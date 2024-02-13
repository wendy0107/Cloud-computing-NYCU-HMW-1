#!/bin/bash

wget https://dl.min.io/server/minio/release/linux-amd64/archive/minio_20231007150738.0.0_amd64.deb -O minio.deb
sudo dpkg -i minio.deb

mkdir ~/minio
minio server ~/minio --console-address :8080
