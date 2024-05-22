import os
import numpy as np
import matplotlib.pyplot as plt
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

def Arr2oxoy(arr):
    dic = {}
    dic['x'] = []; dic['y'] = []
    for i in range(len(arr)):
        for j in range(len(arr[0])):
            if arr[i][j] == 1:
                dic['x'].append(j)
                dic['y'].append(len(arr) - i - 1)
    return dic

def load_GetOxOy(fileName="map.txt"):
    arr = loadAsIntArr(fileName)
    return Arr2oxoy(arr)