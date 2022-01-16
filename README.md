# TRUYENTRANHLH API

# Features

* get manga detail
* get a list of mangas base on genres an more
* get pages image src

# Usage
## Main page
<a href="https://custom-manga-proxy.vercel.app/">
    <p align="left">https://custom-manga-proxy.vercel.app/</p>
</a>

## List of genres
<a href="https://custom-manga-proxy.vercel.app/genres">
    <p align="left">https://custom-manga-proxy.vercel.app/genres</p>
</a>

## Manga page

#### example: 
* mangaEP: sono-bisque-doll-wa-koi-wo-suru
<a href="https://custom-manga-proxy.vercel.app/manga/sono-bisque-doll-wa-koi-wo-suru">
    <p align="left">https://custom-manga-proxy.vercel.app/manga/sono-bisque-doll-wa-koi-wo-suru</p>
</a>

* mangaEP: go-toubun-no-hanayome
<a href="https://custom-manga-proxy.vercel.app/manga/go-toubun-no-hanayome">
    <p align="left">https://custom-manga-proxy.vercel.app/manga/go-toubun-no-hanayome</p>
</a>

#### Attributes

* name (string): The title of the manga
* cover (string): Manga cover's link
* genres (array): An array of manga genres
* otherName (array): Same as above but contains manga other names
* author (array): List of authors
* status (string): Status of the manga
* lastUpdate (date): Time since the last updated
* rating (integer): Rating of the manga base on truyentranhlh data
* view (integer): View count base on truyentranhlh data
* related (array): List of mangas having the same author
* description (string): Manga's short overview
* chapsTotal (integer): Total number of chapters currently available
* chaps (array): List of chapters<br><br>


## Manga reading page
example: 
* mangaEP: go-toubun-no-hanayome
* chapEP: chap-122-285
<a href="https://custom-manga-proxy.vercel.app/manga/go-toubun-no-hanayome/chap-122-285">
    <p align="left">https://custom-manga-proxy.vercel.app/manga/go-toubun-no-hanayome/chap-122-285</p>
</a>

* mangaEP: sono-bisque-doll-wa-koi-wo-suru
* chapEP: chapter-46-140
<a href="https://custom-manga-proxy.vercel.app/manga/sono-bisque-doll-wa-koi-wo-suru/chapter-46-140">
    <p align="left">https://custom-manga-proxy.vercel.app/manga/sono-bisque-doll-wa-koi-wo-suru/chapter-46-140</p>
</a>

#### Attributes

* prevChapter (string): previous chapter EP
* nextChapter (string): next chapter EP
* pages (array): list of chapter's pages<br><br>

## Genres page

#### example: 

* genres: romance
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance</p>
</a>

* genres: comedy
<a href="https://custom-manga-proxy.vercel.app/genres?genre=comedy">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=comedy</p>
</a>

#### Attributes
* totalPages (integer): to indicate the total page available to fetch
* currentPage (integer): which tells you the current page number
* Mangas (obj): Manga obj that contains manga information 

Mangas Object: 
* title (string): the title of the manga
* lastChap (string): title of the last chapter for now
* cover (string): cover of the manga
* lastUpdate (data): date for the recently updated manga
* mangaEP (string): endpoint of the manga use to indicate manga in the detail manga API

#### Parameters<br><br>

#### status: filter by manga status 
| Number  | Value |
| ------------- | ------------- |
| 0  | On going |
| 1  | Canceled |
| 2  | Completed  |

#### example: 
* genres: romance
* status: 0
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance&status=0">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance&status=0</p>
</a>

* genres: comedy
* status: 2
<a href="https://custom-manga-proxy.vercel.app/genres?genre=comedy&status=2">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=comedy&status=2</p>
</a><br>

### sort: filter by condition
| Number  | Value |
| ------------- | ------------- |
| 0  | a-z |
| 1  | z-a |
| 2  | New update  |
| 3  | New manga |
| 4  |  Most viewed |
| 5  | Most Liked  |

#### example: 
* genres: romance
* sort: 1
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance&sort=1">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance&sort=1</p>
</a>

* genres: romance
* sort: 4
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance&sort=4">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance&sort=4</p>
</a><br>

### page: set the page base on totalPages<br><br>
#### example: 
* genres: romance
* page: 10
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance&page=10">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance&page=10</p>
</a>

* genres: romance
* page: 40
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance&page=40">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance&page=40</p>
</a><br><br>

### Multiple conditions:<br>
#### example: 

* genres: romance
* status: 2
* sort: 1
* page: 8
<a href="https://custom-manga-proxy.vercel.app/genres?genre=romance&status=2&sort=1&page=8">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=romance&status=2&sort=1&page=8</p>
</a>

* genres: comedy
* status: 0
* sort: 4
* page: 20
<a href="https://custom-manga-proxy.vercel.app/genres?genre=comedy&status=0&sort=4&page=20">
    <p align="left">https://custom-manga-proxy.vercel.app/genres?genre=comedy&status=0&sort=4&page=20</p>
</a>