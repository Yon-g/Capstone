import os
import numpy as np
import matplotlib.pyplot as plt
import copy
from scipy.ndimage import binary_dilation, binary_erosion, binary_fill_holes

def loadAsIntArr(fileName):
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    f = open(fileName,'r')
    lines = f.readlines()
    arr = []
    for line in lines:
        if len(line) > 0 :
            arr.append(list(map(int,line.strip())))
    return arr

def stringArr2IntArr(arr):
    intArr = []
    for line in arr:
        row = []
        for el in line:
            row.append(int(el))
        intArr.append(row)
    return intArr

def Arr2oxoy(arr):
    iArr = stringArr2IntArr(arr)
    intArr = copy.deepcopy(iArr)
    for i in range(34,67):
        intArr[i][40] = 1
        intArr[i][60] = 1
    for j in range(40,60):
        intArr[34][j] = 1
        intArr[67][j] = 1
    dic = {}
    dic['x'] = []; dic['y'] = []
    for i in range(len(intArr)):
        for j in range(len(intArr[0])):
            if intArr[i][j] == 1:
                dic['x'].append(j)
                dic['y'].append(len(intArr) - i - 1)
    return dic

def load_GetOxOy(fileName="map.txt"):
    arr = loadAsIntArr(fileName)
    return Arr2oxoy(arr)