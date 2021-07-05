const compile = require('./compile');

let req = {
  xml: `<?xml version="1.0" encoding="UTF-8"?>
  <CATALOG>
  <CD>
  <TITLE>Empire Burlesque</TITLE>
  <ARTIST>Bob Dylan</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>Columbia</COMPANY>
  <PRICE>10.90</PRICE>
  <YEAR>1985</YEAR>
  </CD>
  <CD>
  <TITLE>Hide your heart</TITLE>
  <ARTIST>Bonnie Tyler</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>CBS Records</COMPANY>
  <PRICE>9.90</PRICE>
  <YEAR>1988</YEAR>
  </CD>
  <CD>
  <TITLE>Greatest Hits</TITLE>
  <ARTIST>Dolly Parton</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>RCA</COMPANY>
  <PRICE>9.90</PRICE>
  <YEAR>1982</YEAR>
  </CD>
  <CD>
  <TITLE>Still got the blues</TITLE>
  <ARTIST>Gary Moore</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Virgin records</COMPANY>
  <PRICE>10.20</PRICE>
  <YEAR>1990</YEAR>
  </CD>
  <CD>
  <TITLE>Eros &amp; Eros</TITLE>
  <ARTIST>Eros Ramazzotti</ARTIST>
  <COUNTRY>EU</COUNTRY>
  <COMPANY>BMG</COMPANY>
  <PRICE>25.10</PRICE>
  <YEAR>1997</YEAR>
  </CD>
  <CD>
  <TITLE>&quot;Esto tiene que salir bien&quot;</TITLE>
  <ARTIST>Bee Gees</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Polydor</COMPANY>
  <PRICE>25.20</PRICE>
  <YEAR>1998</YEAR>
  </CD>
  <CD>
  <TITLE>&apos;Esto tiene que salir muy bien tambien&apos;</TITLE>
  <ARTIST>Dr.Hook</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>CBS</COMPANY>
  <PRICE>25.10</PRICE>
  <YEAR>1973</YEAR>
  </CD>
  <CD>
  <TITLE>Maggie May</TITLE>
  <ARTIST>Rod Stewart</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Pickwick</COMPANY>
  <PRICE>8.50</PRICE>
  <YEAR>1990</YEAR>
  </CD>
  <CD>
  <TITLE>Romanza</TITLE>
  <ARTIST>Andrea Bocelli</ARTIST>
  <COUNTRY>EU</COUNTRY>
  <COMPANY>Polydor</COMPANY>
  <PRICE calificacion="hola">10.80</PRICE>
  <YEAR>1996</YEAR>
  </CD>
  <CD>
  <TITLE>When a man loves a woman</TITLE>
  <ARTIST>Percy Sledge</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>Atlantic</COMPANY>
  <PRICE>8.70</PRICE>
  <YEAR>1987</YEAR>
  </CD>
  <CD>
  <TITLE>Black angel</TITLE>
  <ARTIST>Savage Rose</ARTIST>
  <COUNTRY>EU</COUNTRY>
  <COMPANY>Mega</COMPANY>
  <PRICE>10.90</PRICE>
  <YEAR>1995</YEAR>
  </CD>
  <CD>
  <TITLE>1999 Grammy Nominees</TITLE>
  <ARTIST>Many</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>Grammy</COMPANY>
  <PRICE>10.20</PRICE>
  <YEAR>1999</YEAR>
  </CD>
  <CD>
  <TITLE>For the good times</TITLE>
  <ARTIST>Kenny Rogers</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Mucik Master</COMPANY>
  <PRICE>8.70</PRICE>
  <YEAR>1995</YEAR>
  </CD>
  <CD>
  <TITLE>Big Willie style</TITLE>
  <ARTIST>Will Smith</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>Columbia</COMPANY>
  <PRICE>9.90</PRICE>
  <YEAR>1997</YEAR>
  </CD>
  <CD>
  <TITLE>Tupelo Honey</TITLE>
  <ARTIST>Van Morrison</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Polydor</COMPANY>
  <PRICE>8.20</PRICE>
  <YEAR>1971</YEAR>
  </CD>
  <CD>
  <TITLE>Soulsville</TITLE>
  <ARTIST>Jorn Hoel</ARTIST>
  <COUNTRY>Norway</COUNTRY>
  <COMPANY>WEA</COMPANY>
  <PRICE>7.90</PRICE>
  <YEAR>1996</YEAR>
  </CD>
  <CD>
  <TITLE>The very best of</TITLE>
  <ARTIST>Cat Stevens</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Island</COMPANY>
  <PRICE>8.90</PRICE>
  <YEAR>1990</YEAR>
  </CD>
  <CD>
  <TITLE>Stop</TITLE>
  <ARTIST>Sam Brown</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>A and M</COMPANY>
  <PRICE>8.90</PRICE>
  <YEAR>1988</YEAR>
  </CD>
  <CD>
  <TITLE>Bridge of Spies</TITLE>
  <ARTIST>T'Pau</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Siren</COMPANY>
  <PRICE>7.90</PRICE>
  <YEAR>1987</YEAR>
  </CD>
  <CD>
  <TITLE>Private Dancer</TITLE>
  <ARTIST>Tina Turner</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>Capitol</COMPANY>
  <PRICE>8.90</PRICE>
  <YEAR>1983</YEAR>
  </CD>
  <CD>
  <TITLE>Midt om natten</TITLE>
  <ARTIST>Kim Larsen</ARTIST>
  <COUNTRY>EU</COUNTRY>
  <COMPANY>Medley</COMPANY>
  <PRICE>7.80</PRICE>
  <YEAR>1983</YEAR>
  </CD>
  <CD>
  <TITLE>Pavarotti Gala Concert</TITLE>
  <ARTIST>Luciano Pavarotti</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>DECCA</COMPANY>
  <PRICE>9.90</PRICE>
  <YEAR>1991</YEAR>
  </CD>
  <CD>
  <TITLE>The dock of the bay</TITLE>
  <ARTIST>Otis Redding</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>Stax Records</COMPANY>
  <PRICE>7.90</PRICE>
  <YEAR>1968</YEAR>
  </CD>
  <CD>
  <TITLE>Picture book</TITLE>
  <ARTIST>Simply Red</ARTIST>
  <COUNTRY>EU</COUNTRY>
  <COMPANY>Elektra</COMPANY>
  <PRICE>7.20</PRICE>
  <YEAR>1985</YEAR>
  </CD>
  <CD>
  <TITLE>Red</TITLE>
  <ARTIST>The Communards</ARTIST>
  <COUNTRY>UK</COUNTRY>
  <COMPANY>London</COMPANY>
  <PRICE>7.80</PRICE>
  <YEAR>1987</YEAR>
  </CD>
  <CD>
  <TITLE>Unchain my heart</TITLE>
  <ARTIST>Joe Cocker</ARTIST>
  <COUNTRY>USA</COUNTRY>
  <COMPANY>EMI</COMPANY>
  <PRICE>8.20</PRICE>
  <YEAR>1987</YEAR>
  </CD>
  </CATALOG>`,

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

query: `declare function local:relacional($valor1 as xs:decimal?,$valor2 as xs:decimal?)
as xs:boolean?
{
let $resultado := ($valor1 eq $valor2) = ($valor1 ne $valor2)
let $resultado2 := ($valor1 gt $valor2) != ($valor1 lt $valor2)

return $resultado = $resultado2
};
local:relacional(100,200)`,  //<- funciona (la más lenta)

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