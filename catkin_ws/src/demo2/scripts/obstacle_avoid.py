#!/usr/bin/env python3
import rospy
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

SAFE_DIST = 0.5
MAX_SPEED = 0.3
TURN_SPEED = 0.6

class ObstacleAvoid:
    def __init__(self):
        rospy.init_node("obstacle_avoid")
        self.pub = rospy.Publisher("/cmd_vel", Twist, queue_size=10)
        rospy.Subscriber("/scan", LaserScan, self.laser_cb)
        self.tw = Twist()

    def laser_cb(self, msg):
        front = min(min(msg.ranges[170:190]), 10)
        left = min(min(msg.ranges[90:180]), 10)
        right = min(min(msg.ranges[180:270]), 10)

        if front < SAFE_DIST:
            self.tw.linear.x = 0.0
            self.tw.angular.z = TURN_SPEED
        elif left < SAFE_DIST - 0.1:
            self.tw.linear.x = MAX_SPEED
            self.tw.angular.z = -TURN_SPEED
        elif right < SAFE_DIST - 0.1:
            self.tw.linear.x = MAX_SPEED
            self.tw.angular.z = TURN_SPEED
        else:
            self.tw.linear.x = MAX_SPEED
            self.tw.angular.z = 0.0

        self.pub.publish(self.tw)

if __name__ == "__main__":
    try:
        ObstacleAvoid()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass