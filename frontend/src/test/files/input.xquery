

for $x in /*/child::book, $y in /*
where $x/price>30
return $x/title