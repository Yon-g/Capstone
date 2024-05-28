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
        row = list(line.strip())
        if len(line) > 0 :
            tmp = [int(row[x]) for x in range(len(row))]
            arr.append(tmp)
    return arr

def stringArr2IntArr(arr):
    intArr = []
    for line in arr:
        row = []
        line = list(line.strip())
        for el in line:
            row.append(int(el))
        intArr.append(row)
    return intArr

def Arr2oxoy(arr):
    intArr = copy.deepcopy(arr)
    print(intArr)
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
                dic['x'].append(i)
                dic['y'].append(j)
    return dic

def load_GetOxOy(fileName="map.txt"):
    arr = loadAsIntArr(fileName)
    return Arr2oxoy(arr)