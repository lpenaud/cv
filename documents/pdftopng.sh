#!/bin/sh

for pdf in $(ls | grep ".pdf$")
do
    png="../images/index/$(echo $pdf | sed 's/.pdf//').png"
    echo "$pdf -> $png"
    convert -background "#FFFFFF" -flatten -density 300 -depth 8 -quality 85 $pdf $png
done
