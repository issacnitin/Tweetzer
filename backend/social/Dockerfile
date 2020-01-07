FROM golang:1.12
LABEL maintainer="nitin.i.joy@gmail.com"
RUN mkdir /work

ENV GOPATH=/work/social
ENV GOBIN=/work/social/bin 

ADD ./social /work/social
ADD ./common /work/common

WORKDIR /work/social
RUN go get
RUN go install
CMD ./bin/social

EXPOSE 8082/tcp