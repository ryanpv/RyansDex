// DOM Objects - vid: https://www.youtube.com/watch?v=wXjSaZb67n8
const mainScreen = document.querySelector('.main-screen'); //querySelector is doc method that returns first element within the HTML
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item'); //querySelectorAll returns all elements matching this specific selector
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');




// Constants and variables
const TYPES = [ 
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 
    'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;

// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1); //ES6 function to capitalize strings***

const resetScreen = () => {
    mainScreen.classList.remove('hide'); //selects the class element of .mainScreen and removes the "token", which in this case is 'hide'
    for (const type of TYPES) { //for loop? declared 'type' as a const to loop through the TYPES variable
    mainScreen.classList.remove(type); //removes the type from the main screen?***
        // console.log(type);
    }
};

const fetchPokeList = url => { // function for right side of screen. ES6 function 
    fetch(url) //fetches the url placed in parameter section when function is called
        .then(res => res.json()) 
        .then(data => {
    // console.log(data);
            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

        for (let i = 0; i < pokeListItems.length ; i++) { //for loop
        const pokeListItem = pokeListItems[i];//pokeListItems is whatever pokemon name, which is on right side of pokedex. pokeListItem is declared as whatever it is
        const resultData = results[i];
        

        if (resultData) {
            const { name, url } = resultData;
            const urlArray = url.split('/'); //separate each item between /'s and turn it into an array with elements
            const id = urlArray[urlArray.length - 2]; //declaring id as the pokemon's number in the url - acquired by accessing the array's 2nd last element with the -2
            pokeListItem.textContent = id + '. ' + capitalize(name); //text content that concatenates the number with period and space then the pokemon's name (capitalized)
            //pokelistItem to return textContent aka the element's content of the text
        } else {
            pokeListItem.textContent = ''; //if no result, text content will not be changed and therefore will show blank in the html doc
        }
        }
    });
};

const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)//fetching the pokemon number id
    .then(res => res.json())
    .then(data => {
        resetScreen();

        const dataTypes = data['types']; //declaring dataTypes as 'data' which accesses the 'types' array of the API
        const dataFirstType = dataTypes[0]; //accessing the 0 index of the 'types' array and declaring as first type
        const dataSecondType = dataTypes[1]; //accessing index 1 and declaring as second type
        pokeTypeOne.textContent = capitalize(dataTypes[0]['type']['name']);//grabs the .poke-type-one class and capitalizes it's name. grabs 0 index of type array and gets the 'name' element of the array to capitalize
        console.log(data); 
        if (dataSecondType) { //if statement for if second type exists
            pokeTypeTwo.classList.remove('hide'); //remove the 'hide' 'token' from the element to show on the screen
            pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']); //capitalize the second type name by accessing the array elements
            // console.log(pokeTypeTwo)
        } else {
            pokeTypeTwo.classList.add('hide'); //add back the 'hide' token if no second type found so nothing shows up
            pokeTypeTwo.textContent = ''; //return empty string if no second type
        }
        mainScreen.classList.add(dataFirstType['type']['name']); //adds the first type name back to mainscreen to show the css colour background
        //the type token is added to the mainScreen class (i.e "main-screen fire") and referenced in css as a colour ('fire' token to be orange)
        
        pokeName.textContent = capitalize(data['name']);//capitalizing the pokemon's name
        pokeId.textContent = '#' + data['id'].toString().padStart(3, 'X'); //defines the text content of the poke-id(HTML) as # sign concatenated with the API's 'id' element as a string.
        //padStart method pads the string with 'X's until length of string is 3
        pokeWeight.textContent = data['weight']; //grabs the weight data from pokeapi
        pokeHeight.textContent = data['height']; // grabs height data
        pokeFrontImage.src = data['sprites']['front_default'] || ''; //grabs the front image through source of API's sprite array or returns empty string if it doesn't exist
        pokeBackImage.src = data['sprites']['back_default'] || ''; //grabs back image or returns empty if doesnt exist
    });
}

const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
};

const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl); //fetches next list from url called by fetchPokeList();
    }
};

const handleListItemClick = (e) => {
    if (!e.target) return; //if target doesn't exist, return nothing

    const listItem = e.target; //declaring listItem (list of pokemon on right side) as e.target
    if (!listItem.textContent) return; 
    
    const id = listItem.textContent.split('.')[0];//?? split the '.' from ???
    fetchPokeData(id);

};

// Adding event listeners
leftButton.addEventListener('click', handleLeftButtonClick); 
rightButton.addEventListener('click', handleRightButtonClick); //pass function as a reference, NOT calling it as with ()
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}

// initialize app
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'); //pokelist will be limited to 20 results starting from 0