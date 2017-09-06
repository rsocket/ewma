set terminal png size 1080,920
set key autotitle columnhead title "Half Life"
set xlabel "Interval"

set output "sawtooth.png"
set title "sawtooth at interval of 500"
plot [0:40] for [col=2:9] "sawtooth.data" using col:xtic(1) with lp

set output "abs.png"
set title "|sin(t)| at interval of 500"
plot [0:40] for [col=2:9] "abs.data" using col:xtic(1) with lp

set output "sin.png"
set title "sin(t/2)/2 at interval of 500"
plot [0:40] for [col=2:9] "sin.data" using col:xtic(1) with lp
