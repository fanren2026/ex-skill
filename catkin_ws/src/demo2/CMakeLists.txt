cmake_minimum_required(VERSION 3.0.2)
project(demo2)

find_package(catkin REQUIRED COMPONENTS
  urdf
  xacro
  gazebo_ros
  rospy
  geometry_msgs
  sensor_msgs
)

catkin_package(
  CATKIN_DEPENDS urdf xacro gazebo_ros rospy geometry_msgs sensor_msgs
)

include_directories(
  ${catkin_INCLUDE_DIRS}
)

catkin_install_python(PROGRAMS
  scripts/obstacle_avoid.py
  DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)

install(DIRECTORY urdf launch
  DESTINATION ${CATKIN_PACKAGE_SHARE_DESTINATION}
)