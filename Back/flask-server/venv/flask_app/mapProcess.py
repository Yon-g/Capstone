import os
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import binary_dilation, binary_erosion, binary_fill_holes

#문자열배열 => 2차원 정수 배열
def chgDTypeInt(arr):
    changed = []
    for line in arr:
        if len(line) > 0 :
            changed.append(list(map(int,line.strip())))
    return changed

#배열 매끄럽게 변환
def smooth_walls(array):
    wall_array = np.array(array)
    # 이진 팽창
    dilated = binary_dilation(wall_array, structure=np.ones((7,7)))
    # 이진 침식
    eroded = binary_erosion(dilated, structure=np.ones((7,7)))
    # 내부 구멍을 채움
    smoothed = binary_fill_holes(eroded)
    
    return smoothed

#이미지 저장 함수(하늘색-흰색)
def save_img(arr,imgname="map_image.png"):
    skyB_wht = plt.cm.colors.ListedColormap(['skyblue', 'white'])
    plt.imsave(imgname,arr, cmap=skyB_wht)

def totalProcess(arr,fileName):
    intArr = chgDTypeInt(arr)
    smoothed = smooth_walls(intArr)
    save_img(smoothed,fileName)
    return intArr

if __name__ == '__main__':
    # 예시 벽 배열 (0은 빈 공간, 1은 벽)
    # # 예시 벽 배열 (0은 빈 공간, 1은 벽)
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    f = open("map2.txt",'r')
    lines = f.readlines()
    arr = []
    for line in lines:
        if len(line) > 0 :
            arr.append(list(map(int,line.strip())))
    # print(arr)
    smoothed_wall = smooth_walls(arr)
    plt.imsave('wall_image.png',smoothed_wall, cmap='ocean')

    # 결과 출력
    plt.subplot(1, 2, 1)
    plt.title("Original Wall")
    plt.imshow(arr, cmap='gray')

    plt.subplot(1, 2, 2)
    plt.title("Smoothed Wall")
    plt.imshow(smoothed_wall, cmap='gray')

    plt.show()