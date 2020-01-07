FROM golang:1.12
LABEL maintainer="nitin.i.joy@gmail.com"
RUN mkdir /work

ENV GOPATH=/work/tweet
ENV GOBIN=/work/tweet/bin 

ADD ./tweet /work/tweet
ADD ./common /work/common

WORKDIR /work/tweet
RUN go get
RUN go install
CMD ./bin/tweet

EXPOSE 8081/tcp