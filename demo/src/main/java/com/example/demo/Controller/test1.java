package com.example.demo.Controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

class Truck{
    int weight;
    int dis;

    public Truck(int weight, int dis){
        this.weight = weight;
        this.dis = dis;
    }
}

public class test1 {
    public static int count = 0;
    public static final int max = 100000001;
    public static Queue<Integer> queue = new LinkedList<>();
    public static int[][] visited = null;
    public static int[][] matrix = null;
    public static int[] dx = {1,-1,0,0};
    public static int[] dy = {0,0,1,-1};
    public static int ans = 0;

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] arr = br.readLine().split(" ");
        int n = Integer.parseInt(arr[0]);
        int w = Integer.parseInt(arr[1]);
        int l = Integer.parseInt(arr[2]);

        Queue<Truck> queue = new LinkedList<>();
        arr = br.readLine().split(" ");

        int time = 0;
        int idx = 0;
        int truckSum = 0;
        while(idx < n){
            //빈값이면
            if(queue.size() == 0){
                int element = Integer.parseInt(arr[idx]);
                queue.add(new Truck(element, ));
                truckSum += element;
            } else{
                //큐에 넣을 수 있는지

                if()

                //큐에 넣을 수 없는지
            }
            time++;
        }

        System.out.println(time);



    }


}
