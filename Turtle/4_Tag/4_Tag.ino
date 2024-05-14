/*
   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/

/* 
 * StandardRTLSTag_TWR.ino
 * 
 * This is an example tag in a RTLS using two way ranging ISO/IEC 24730-62_2013 messages
 */
#include <SPI.h>
#include <DW1000Ng.hpp>
#include <DW1000NgUtils.hpp>
#include <DW1000NgTime.hpp>
#include <DW1000NgConstants.hpp>
#include <DW1000NgRanging.hpp>
#include <DW1000NgRTLS.hpp>

// connection pins
const uint8_t PIN_SCK = 18;
const uint8_t PIN_MOSI = 23;
const uint8_t PIN_MISO = 19;
const uint8_t PIN_SS = 4;
const uint8_t PIN_RST = 15;
const uint8_t PIN_IRQ = 17;

uint16_t anchorA = 1;
uint16_t anchorB = 2;
uint16_t anchorC = 3;

double range_anchor[] = {0.0,0.0,0.0};

// Extended Unique Identifier register. 64-bit device identifier. Register file: 0x01
const char EUI[] = "AA:BB:CC:DD:EE:FF:00:00";

volatile uint32_t blink_rate = 200;

device_configuration_t DEFAULT_CONFIG = {
    false,
    true,
    true,
    true,
    false,
    SFDMode::STANDARD_SFD,
    Channel::CHANNEL_5,
    DataRate::RATE_850KBPS,
    PulseFrequency::FREQ_16MHZ,
    PreambleLength::LEN_256,
    PreambleCode::CODE_3
};

frame_filtering_configuration_t TAG_FRAME_FILTER_CONFIG = {
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false
};

sleep_configuration_t SLEEP_CONFIG = {
    false,  // onWakeUpRunADC   reg 0x2C:00
    false,  // onWakeUpReceive
    false,  // onWakeUpLoadEUI
    true,   // onWakeUpLoadL64Param
    true,   // preserveSleep
    true,   // enableSLP    reg 0x2C:06
    false,  // enableWakePIN
    true    // enableWakeSPI
};
static boolean waitForNextRangingStep() {
    DW1000NgRTLS::waitForTransmission();
    if(!DW1000NgRTLS::receiveFrame()) return false;
    return true;
}

uint32_t calculateNewBlinkRate(byte* act_recv) {
    // Example calculation, replace with your own logic
    return 1000;
}

static RangeResult RangeResult_AnchorA(uint16_t anchor, uint16_t replyDelayUs) {
  RangeResult returnValue;

  byte target_anchor[2];
  DW1000NgUtils::writeValueToBytes(target_anchor, anchor, 2);
  DW1000NgRTLS::transmitPoll(target_anchor);
  /* Start of poll control for range */
  if(!waitForNextRangingStep()) {
      returnValue = {false, false, 0, 0};
  } else {

      size_t cont_len = DW1000Ng::getReceivedDataLength();
      byte cont_recv[cont_len];
      DW1000Ng::getReceivedData(cont_recv, cont_len);

      if (cont_len > 10 && cont_recv[9] == ACTIVITY_CONTROL && cont_recv[10] == RANGING_CONTINUE) {
          /* Received Response to poll */
          DW1000NgRTLS::transmitFinalMessage(
              &cont_recv[7], 
              replyDelayUs, 
              DW1000Ng::getTransmitTimestamp(), // Poll transmit time
              DW1000Ng::getReceiveTimestamp()  // Response to poll receive time
          );
          // if(DW1000NgRTLS::receiveFrame()){
          //   size_t recv_len = DW1000Ng::getReceivedDataLength();
          //   byte recv_data[recv_len];
          //   DW1000Ng::getReceivedData(recv_data, recv_len);

          //   double range = static_cast<double>(DW1000NgUtils::bytesAsValue(&recv_data[10],2) / 1000.0);
          //   // String rangeString = "Range: "; rangeString += range; rangeString += " m";
          //   // rangeString += "\t RX power: "; rangeString += DW1000Ng::getReceivePower(); rangeString += " dBm";
          //   // range_anchor[recv_data[7]-1] = range;

          //   String rangeString = " Range: "; rangeString+= recv_data[7]; rangeString += range; rangeString += " m";
          //   Serial.println(rangeString);
          //   // Serial.println(range_anchor[recv_data[7]-1]);

          // }
      } else {
          returnValue = {false, false, 0, 0};
      }
      
  }

  return returnValue;
}

void rangeTask(void* parameter) {
    uint16_t anchor = *((uint16_t*)parameter);
    for (;;) {
        RangeResult res = RangeResult_AnchorA(anchor, 1500);
        if (res.success) {
            blink_rate = res.new_blink_rate;
        }
        vTaskDelay(100);
    }
}

void setup() {
    // DEBUG monitoring
    Serial.begin(115200);

    pinMode(PIN_RST, OUTPUT);
    digitalWrite(PIN_RST, LOW);
    delay(100);
    digitalWrite(PIN_RST, HIGH);

    Serial.println(F("### DW1000Ng-arduino-ranging-tag ###"));
    // initialize the driver
    DW1000Ng::initialize(PIN_SS, PIN_IRQ, PIN_RST);
    Serial.println("DW1000Ng initialized ...");
    // general configuration
    DW1000Ng::applyConfiguration(DEFAULT_CONFIG);
    DW1000Ng::enableFrameFiltering(TAG_FRAME_FILTER_CONFIG);
    
    DW1000Ng::setEUI(EUI);
    DW1000Ng::setDeviceAddress(4);
    DW1000Ng::setNetworkId(RTLS_APP_ID);

    DW1000Ng::setAntennaDelay(16436);

    DW1000Ng::applySleepConfiguration(SLEEP_CONFIG);

    DW1000Ng::setPreambleDetectionTimeout(15);
    DW1000Ng::setSfdDetectionTimeout(273);
    DW1000Ng::setReceiveFrameWaitTimeoutPeriod(2000);
    
    Serial.println(F("Committed configuration ..."));
    // DEBUG chip info and registers pretty printed
    char msg[128];
    DW1000Ng::getPrintableDeviceIdentifier(msg);
    Serial.print("Device ID: "); Serial.println(msg);
    DW1000Ng::getPrintableExtendedUniqueIdentifier(msg);
    Serial.print("Unique ID: "); Serial.println(msg);
    DW1000Ng::getPrintableNetworkIdAndShortAddress(msg);
    Serial.print("Network ID & Device Address: "); Serial.println(msg);
    DW1000Ng::getPrintableDeviceMode(msg);
    Serial.print("Device mode: "); Serial.println(msg);    

    // Create tasks for each anchor
    xTaskCreate(rangeTask, "RangeTaskA", 4096, &anchorA, 1, NULL);
    xTaskCreate(rangeTask, "RangeTaskB", 4096, &anchorB, 1, NULL);
    xTaskCreate(rangeTask, "RangeTaskC", 4096, &anchorC, 1, NULL);
}

void loop() {
}

