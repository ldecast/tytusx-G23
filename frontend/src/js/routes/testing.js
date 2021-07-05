const compile = require('./compile');

let req = {
  xml: `<?xml version="1.0" encoding="UTF-8"?>
  <bookstore>
  
  <book category="COOKING">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
  
  <book category="CHILDREN">
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
  
  <book category="WEB">
    <title lang="en">XQuery Kick Start</title>
    <author>James McGovern</author>
    <author>Per Bothner</author>
    <author>Kurt Cagle</author>
    <author>James Linn</author>
    <author>Vaidyanathan Nagarajan</author>
    <year>2003</year>
    <price>49.99</price>
  </book>
  
  <book category="WEB">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>
  
  </bookstore>`,

  // query: `declare function local:ackerman($m as xs:integer,$n as xs:integer) as xs:integer
  // {
  //   if ($m=0) then $n+1
  //   else if ($m gt 0 and $n =0) then local:ackerman($m-1, 1)
  //   else local:ackerman($m-1, local:ackerman($m, $n-1))
  // };
  // local:ackerman(3,3)`,


//   query: `declare function local:fibo_numbers($num1 as xs:integer, $num2 as xs:integer, $limit as xs:integer) as xs:integer* {
//     if ($limit > 0) then local:fibo_numbers($num2, $num1 + $num2, $limit -1)
//     else $num1
// };

// declare function local:fibo_sequence($limit as xs:integer) as xs:integer* {
//     local:fibo_numbers(0, 1, $limit)
// };

// local:fibo_sequence(25)
// `,

<<<<<<< HEAD
query: `number("6"),
substring("hola mundo",3),
upper-case("calificacion en mayusculas"),
lower-case("CALIFICACION EN MINUSCULAS"),
string(1511861)`,  //<- funciona (la más lenta)
=======
query: `let $x := /bookstore/book
if ($x/@category="COOKING")
then $x/title
else if ($x/@category="WEB")
then data($x/price)
else ()`,  //<- funciona (la más lenta)
>>>>>>> master

  grammar: 1
}
/* let $x := /bookstore/book
  if ($x/@category="zzz")
  then data($x/title)
  else if ($x/@category="---")
  then data($x/price)
  else if ($x/@category="WEB")
  then data($x/year)
  else if ($x/@category="COOKING")
  then data($x/price)
  else () */

// let $books := bookstore/book[price > 30]
//  return $books

/*
for $x in /bookstore/book,
$y in /bookstore/book/author,
$z in /bookstore/book/title
return $z
R/ 4 titles*/

/*
for $x in /bookstore/book[3]
return $x/author[last()]/..
R/ 3er libro*/

/*
for $x in /bookstore/book
where $x/price>30.00
return $x/author[1]/text()
R/ [James McGovern] //, Erik T. Ray*/

/* 
for $x in doc("books.xml")/bookstore/book
where $x/price<=30
order by $x/title
return $x/price
R/ 30.00, 29.99*/

/*
for $x in doc("books.xml")/bookstore/book
where $x[@category="WEB"]
order by $x/title
return data($x/title)
R/ Learning XML, XQuery Kick Start*/

/*
for $x at $i in doc("books.xml")/bookstore/book/author
return $i
R/ 1-8*/

/*
for $x in doc("books.xml")/bookstore/book
return if ($x/@category="wdwd")
then data($x/title)
else if ($x/@category="gg")
then data($x/price)
else if ($x/@category="WEBB")
then data($x/year)
else if ($x/@category="WEB")
then data($x/price)
else ()
R/ 49.99, 39.95*/

/*
let $x := /bookstore/book
let $z := /bookstore/book/title
return if ($x/@category="WEB")
then $x//@lang/..
else ()
R/ 2 titles: XQuery, Learning XML*/

/*
let $x := /bookstore/book
if ($x/@category="COOKING")
then data($x/title)
else if ($x/@category="WEB")
then data($x/price)
else ()
R/ Everyday Italian*/

/*
let $x := 3
let $y := 12 div $x
let $z := $x+$y
return $z - $x + 1
R/ 5*/

/*

let $y := upper-case("hola")
let $x := substring($y, 2, 1)
return $x
R/ O */

compile.compile(req);