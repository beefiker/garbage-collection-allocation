# Garbage Collection Time Reduction

## Introduction

This is a simple project to demonstrate how garbage collection time can be reduced by using cache storing instead of the spread operator.

## How to run the project

1. Clone the project
2. Run `node garbage-collection.js <type> <count> <keyCount>` in the terminal
3. The script will run and display the memory usage at the end

## Parameters

- `type`: Type of operation to run
  | Type | Description |
  | --- | --- |
  | 0 | Spread Operator |
  | 1 | Cache storing |
- `count`: Number of iterations to run the script
- `keyCount`: Number of object keys to store in the cache
