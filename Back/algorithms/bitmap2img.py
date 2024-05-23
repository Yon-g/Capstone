import os
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import binary_dilation, binary_erosion, binary_fill_holes

def smooth_walls(wall_array):
    # 이진 팽창
    dilated = binary_dilation(wall_array, structure=np.ones((7,7)))
    # 이진 침식
    eroded = binary_erosion(dilated, structure=np.ones((7,7)))
    # 내부 구멍을 채움
    smoothed = binary_fill_holes(eroded)
    
    return smoothed

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

# 예시 벽 배열 (0은 빈 공간, 1은 벽)
# # 예시 벽 배열 (0은 빈 공간, 1은 벽)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    f = open("c.txt",'r')
    lines = f.readlines()
    arr = []
    for line in lines:
        if len(line) > 0 :
            arr.append(list(map(int,line.strip())))
    print(len(arr),len(arr[0]))
    # print(arr)``
    f.close()
    smoothed_wall = smooth_walls(arr)
    cmap1 = plt.cm.colors.ListedColormap(['gray', 'white'])
    plt.imsave('map_test_image.png',smoothed_wall, cmap=cmap1)

    # 결과 출력
    plt.subplot(1, 2, 1)
    plt.title("Original Wall")
    plt.imshow(arr, cmap='gray')

    plt.subplot(1, 2, 2)
    plt.title("Smoothed Wall")
    plt.imshow(smoothed_wall, cmap=cmap1)

    plt.show()
    