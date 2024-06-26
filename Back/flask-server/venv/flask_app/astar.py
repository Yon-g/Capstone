"""
A* grid planning

author: Atsushi Sakai(@Atsushi_twi)
        Nikos Kanargias (nkana@tee.gr)

See Wikipedia article (https://en.wikipedia.org/wiki/A*_search_algorithm)
"""

import math
import copy
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
import os, csv
from bitmap2img import load_GetOxOy, loadAsIntArr, Arr2oxoy
from mapProcess import smooth_walls
from itertools import permutations

show_animation = False

grid_size = 1.0  # [m]
robot_radius = 3.0  # [m]
CrashWeight = 5.0
num_robot = 4

def radian2degree(radian):
    PI = 3.141592
    if radian >= 0 :
        return round(180.0 - (radian / PI) * 180.0, 2)
    else :
        return round(180.0 + ((-radian) / PI) * 180.0, 2)
 
class AStarPlanner:

    def __init__(self, ox, oy, resolution, rr):
        
        """
        Initialize grid map for a star planning

        ox: x position list of Obstacles [m]
        oy: y position list of Obstacles [m]
        resolution: grid resolution [m]
        rr: robot radius[m]
        """

        self.resolution = resolution
        self.rr = rr
        self.min_x, self.min_y = 0, 0
        self.max_x, self.max_y = 0, 0
        self.obstacle_map = None
        self.x_width, self.y_width = 0, 0
        self.motion = self.get_motion_model()
        self.calc_obstacle_map(ox, oy)

    class Node:
        def __init__(self, x, y, cost, parent_index):
            self.x = x  # index of grid
            self.y = y  # index of grid
            self.cost = cost
            self.parent_index = parent_index

        def __str__(self):
            return str(self.x) + "," + str(self.y) + "," + str(
                self.cost) + "," + str(self.parent_index)

    def planning(self, sx, sy, gx, gy):
        """
        A star path search

        input:
            s_x: start x position [m]
            s_y: start y position [m]
            gx: goal x position [m]
            gy: goal y position [m]

        output:
            rx: x position list of the final path
            ry: y position list of the final path
        """

        start_node = self.Node(self.calc_xy_index(sx, self.min_x),
                               self.calc_xy_index(sy, self.min_y), 0.0, -1)
        
        goal_node = self.Node(self.calc_xy_index(gx, self.min_x),
                              self.calc_xy_index(gy, self.min_y), 0.0, -1)

        open_set, closed_set = dict(), dict()
        open_set[self.calc_grid_index(start_node)] = start_node
        

        while True:
            if len(open_set) == 0:
                print("Open set is empty..")
                break

            c_id = min(
                open_set,
                key=lambda o: open_set[o].cost + self.calc_heuristic(goal_node,
                                                                     open_set[
                                                                         o]))
            current = open_set[c_id]

            # show graph
            if show_animation:  # pragma: no cover
                plt.plot(self.calc_grid_position(current.x, self.min_x),
                         self.calc_grid_position(current.y, self.min_y), "xc")
                # for stopping simulation with the esc key.
                plt.gcf().canvas.mpl_connect('key_release_event',
                                             lambda event: [exit(
                                                 0) if event.key == 'escape' else None])
                if len(closed_set.keys()) % 10 == 0:
                    plt.pause(0.001)

            if current.x == goal_node.x and current.y == goal_node.y:
                print("Find goal")
                goal_node.parent_index = current.parent_index
                goal_node.cost = current.cost
                break

            # Remove the item from the open set
            del open_set[c_id]

            # Add it to the closed set
            closed_set[c_id] = current

            # expand_grid search grid based on motion model
            for i, _ in enumerate(self.motion):
                node = self.Node(current.x + self.motion[i][0],
                                 current.y + self.motion[i][1],
                                 current.cost + self.motion[i][2], c_id)
                n_id = self.calc_grid_index(node)

                # If the node is not safe, do nothing
                if not self.verify_node(node):
                    continue

                if n_id in closed_set:
                    continue

                if n_id not in open_set:
                    open_set[n_id] = node  # discovered a new node
                else:
                    if open_set[n_id].cost > node.cost:
                        # This path is the best until now. record it
                        open_set[n_id] = node

        rx, ry = self.calc_final_path(goal_node, closed_set)

        return rx, ry

    def calc_final_path(self, goal_node, closed_set):
        # generate final course
        rx, ry = [self.calc_grid_position(goal_node.x, self.min_x)], [
            self.calc_grid_position(goal_node.y, self.min_y)]
        parent_index = goal_node.parent_index
        while parent_index != -1:
            n = closed_set[parent_index]
            rx.append(self.calc_grid_position(n.x, self.min_x))
            ry.append(self.calc_grid_position(n.y, self.min_y))
            parent_index = n.parent_index

        return rx, ry

    @staticmethod
    def calc_heuristic(n1, n2):
        w = 1.0  # weight of heuristic
        d = w * math.hypot(n1.x - n2.x, n1.y - n2.y)
        return d

    def calc_grid_position(self, index, min_position):
        """
        calc grid position

        :param index:
        :param min_position:
        :return:
        """
        pos = index * self.resolution + min_position
        return pos

    def calc_xy_index(self, position, min_pos):
        return round((position - min_pos) / self.resolution)

    def calc_grid_index(self, node):
        return (node.y - self.min_y) * self.x_width + (node.x - self.min_x)

    def verify_node(self, node):
        px = self.calc_grid_position(node.x, self.min_x)
        py = self.calc_grid_position(node.y, self.min_y)

        if px < self.min_x:
            return False
        elif py < self.min_y:
            return False
        elif px >= self.max_x:
            return False
        elif py >= self.max_y:
            return False

        # collision check
        if self.obstacle_map[node.x][node.y]:
            return False

        return True

    def calc_obstacle_map(self, ox, oy):

        self.min_x = round(min(ox))
        self.min_y = round(min(oy))
        self.max_x = round(max(ox))
        self.max_y = round(max(oy))
        print("min_x:", self.min_x)
        print("min_y:", self.min_y)
        print("max_x:", self.max_x)
        print("max_y:", self.max_y)

        self.x_width = round((self.max_x - self.min_x) / self.resolution)
        self.y_width = round((self.max_y - self.min_y) / self.resolution)
        print("x_width:", self.x_width)
        print("y_width:", self.y_width)

        # obstacle map generation
        self.obstacle_map = [[False for _ in range(self.y_width)]
                             for _ in range(self.x_width)]
        for ix in range(self.x_width):
            x = self.calc_grid_position(ix, self.min_x)
            for iy in range(self.y_width):
                y = self.calc_grid_position(iy, self.min_y)
                for iox, ioy in zip(ox, oy):
                    d = math.hypot(iox - x, ioy - y)
                    if d <= self.rr:
                        self.obstacle_map[ix][iy] = True
                        break

    @staticmethod
    def get_motion_model():
        # dx, dy, cost
        motion = [[1, 0, 1],
                  [0, 1, 1],
                  [-1, 0, 1],
                  [0, -1, 1],
                  [-1, -1, math.sqrt(2)],
                  [-1, 1, math.sqrt(2)],
                  [1, -1, math.sqrt(2)],
                  [1, 1, math.sqrt(2)]]

        return motion

def isSafe(x1,y1,x2,y2,radius):
    square_distance = ((x1 - x2)**2 + (y1 - y2)**2)
    if square_distance <= (2*radius)**2 : return False
    else : return True

def SLAM_TO_Array(source = "relative path of map image file"):
    absolute_path = os.path.dirname(os.path.realpath(__file__))
    img_path = absolute_path + "/" + source
    mapImg = Image.open(img_path)
    mapImg.show()
    mapArray = np.array(mapImg)
    mapArrayStr = []

    for i in range(mapArray.shape[0]):
        line = []
        for j in range(mapArray.shape[1]):
            line.append(str(mapArray[i][j]))
        mapArrayStr.append(line)

    mapInt = [[0 for _ in range(len(mapArrayStr[0]))]for _ in range(len(mapArrayStr))]

    for i in range(len(mapArrayStr)):
        for j in range(len(mapArrayStr[0])):
            if mapArrayStr[i][j] != '254' : mapInt[i][j] = 0
            else : mapInt[i][j] = 1

    #mapInt 배열에서 1은 갈 수 있는 곳, 0은 갈 수 없는 곳

    # csv파일로 저장
    with open(absolute_path+"/"+'MAP2arr.csv',"w") as file:
        writer = csv.writer(file)
        writer.writerows(mapInt)

    return mapInt

def generateNewPlanner(arr):
    global grid_size, robot_radius, num_robot

    obstacle = Arr2oxoy(arr)

    ox = obstacle['x']
    oy = obstacle['y']

    return AStarPlanner(ox, oy, grid_size, robot_radius)

def get_best_path(a_star,sx,sy,gx,gy):
    global grid_size, robot_radius, CrashWeight, num_robot

    paths = []
    combos = []
    pmts = list(permutations([0,1,2,3],4))

    for p in range(len(pmts)):
        path = []
        combo = []
        for i in range(num_robot):
            path.append(list(a_star.planning(sx[pmts[p][i]], sy[pmts[p][i]], gx[i], gy[i])))
            combo.append([pmts[p][i],i])
        combos.append(combo)
        paths.append(path)

    for branch in range(len(paths)):
        dataOfbranch = []
        lengthOfEach = []
        crushSpot = []

        for i in range(num_robot):
            lengthOfEach.append(len(paths[branch][i][0]))

        for i in range(num_robot):
            for j in range(i+1,num_robot):
                if len(paths[branch][i][0]) >= len(paths[branch][j][0]):
                    shorter = j
                    longer = i
                else :
                    shorter = i
                    longer = j

                for d in range(len(paths[branch][shorter][0])):
                    if not isSafe(paths[branch][i][0][d],paths[branch][i][1][d],paths[branch][j][0][d],paths[branch][j][1][d],robot_radius):
                        crushSpot.append([(shorter,longer), (paths[branch][shorter][0][d],paths[branch][shorter][1][d])])
                        break
        
        dataOfbranch = [sum(lengthOfEach),lengthOfEach,crushSpot]
        paths[branch].append(dataOfbranch)
    
    best = 0
    best_score = float('INF')
    for i in range(len(paths)):
        tmpData = paths[i][num_robot]
        score = tmpData[0] + max(tmpData[1])
        eachPathCrash = [0,0,0,0]

        for crush in tmpData[2]:
            eachPathCrash[crush[0][0]] += 1
            eachPathCrash[crush[0][1]] += 1

        for el in eachPathCrash:
            score += (0.5 * el) * CrashWeight

        # print(i,"번째",tmpData[0],max(tmpData[1]),eachPathCrash,"점수 :",score)
        if score < best_score :    
            best = i
            best_score = score

    print(combos[best])

    # colors = ["-r","-b","-g","-y"]
    # markers_s = ["or","ob","og","oy"]
    # markers_g = ["or","ob","og","oy"]

    # if True:  # pragma: no cover
    #     for i in range(num_robot):
    #         plt.plot(sx[combos[best][i][0]], sy[combos[best][i][0]], markers_s[combos[best][i][0]])
    #         plt.plot(gx[combos[best][i][1]], gy[combos[best][i][1]], markers_g[combos[best][i][1]])
    #         plt.grid(True)
    #         plt.axis("equal")
    # if True:  # pragma: no cover
    #     for i in range(num_robot):
    #         plt.plot(paths[best][i][0], paths[best][i][1], colors[i])
    #         plt.pause(0.0005)
    #     plt.show()

    return paths[best][0:4], combos[best]


def get_fixed_path(a_star,sx,sy,gx,gy):
    global grid_size, robot_radius, CrashWeight, num_robot

    fixed_paths = []
    for i in range(num_robot):
        fixed_paths.append(list(a_star.planning(sx[i], sy[i], gx[i], gy[i])))
    
    return fixed_paths[0:4]


def run():
    print(__file__ + " start!!")
    num_robot = 4
    # set obstacle positions
    ox, oy = [], []

    sx = [14,86,81,16]
    sy = [21,21,81,76]

    gx = [44,57,57,44]
    gy = [67,67,32,32]

    colors = [".g",".r",".y",".b"]
    markers_s = ["og","or","oy","ob"]
    markers_g = ["og","or","oy","ob"]

    a_star = generateNewPlanner(loadAsIntArr("map2.txt"))

    paths, combo = get_best_path(a_star,sx,sy,gx,gy)

    print(combo)

    colors = ["-g","-r","-y","-b"]
    plt.plot(ox, oy, ".k")
    if True:  # pragma: no cover
        for i in range(num_robot):
            plt.plot(sx[combo[i][0]], sy[combo[i][0]], markers_s[combo[i][0]])
            plt.plot(gx[combo[i][1]], gy[combo[i][1]], markers_g[combo[i][1]])
            plt.grid(True)
            plt.axis("equal")
    print(paths)
    if True:  # pragma: no cover
        # plt.plot(paths[i][0], paths[i][1], colors[i])
        for i in range(num_robot):
            plt.plot(paths[i][0], paths[i][1], colors[i])
            plt.pause(0.0005)
        plt.show()
    
if __name__ == '__main__':
    run()