const PATH = "./words.json";
const THRESHOLD = 25;

let word_list = [];

let search_element;

window.addEventListener("DOMContentLoaded", () => {
    fetch(PATH)
    .then(response => response.json())
    .then(item => {
        word_list = item.words;
        // console.log(words);
        search_element = document.getElementById("search_element");
        word_list.sort();
        Render_Words(word_list);
        Start();
    })
})

function Render_Words(words){
    let words_element = document.getElementById("words_element");
    words_element.innerHTML = "";
    words.forEach(word => {
        let p = document.createElement("p");
        p.innerHTML = word;
        words_element.appendChild(p);
    });
}

function Start(){
    search_element.addEventListener("input", () => {
        if(search_element.value == ""){
            Render_Words(word_list);
            return;
        }
        console.log(search_element.value);
        let new_render = Generate_NewList_BasedOnPercentage(search_element.value);
        Render_Words(new_render);
    });
}

function Generate_NewList_BasedOnPercentage(searched_value) {
    let points = [];
    word_list.forEach(word => {
        let increment = 100 / word.length;
        let bigger_point = 0;
        let temp_points = 0;

        for (let i = 0; i < word.length; i++) {
            let j = 0;
            temp_points = 0;

            while (i + j < word.length && j < searched_value.length && word[i + j] === searched_value[j]) {
                temp_points += increment * (1 / (i+1));
                j++;
            }

            if (temp_points > bigger_point) {
                bigger_point = temp_points;
            }
        }

        points.push(bigger_point);
    });

    let point_map = word_list.map((word, i) => {
        return { word: word, points: points[i] };
    });

    point_map.sort((a, b) => b.points - a.points);

    console.log(point_map);

    point_map = point_map.filter(item => item.points >= THRESHOLD);

    let new_array = point_map.map(item => item.word);

    return new_array;
}

