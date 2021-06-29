for $x in /bookstore[price > 30 or price < 15 or price < 15]//book
where $x/price>30
order by $x/title
return $x/title