const params = new URLSearchParams(window.location.search);
let query = params.get('x');
let page = params.get('page');

const searchbar = document.getElementById("searchbar")
const searchButton = document.getElementById("searchButton");
const contentDiv = document.getElementById("contentDiv");

const dictionaryPath = '/data/dictionary.json';
const abbreviationPath = '/data/abbreviations.json';
const referencesPath = '/data/references.json';

const referencesResponse = await fetch(referencesPath);
const references = await referencesResponse.json();

searchbar.focus();

if (query != null) {
    const response = await fetch(dictionaryPath);
    const dictionary = await response.json();
    var matches = [];
    var content = "";
    document.title = query + " | Latinarium";
    searchbar.value = query;

    outer:
    // Search all entries
    for (var i = 0; i < dictionary.length; i++) {
        // Search lemma
        const lCheck = " " + dictionary[i].l + " ";
        if (lCheck.includes(" " + query + " ") ||
            lCheck.includes(" " + query + ",")) {
            matches.push(dictionary[i]);
            continue outer;
        }
        // Search all translations for each entry
        for (var j = 0; j < dictionary[i].t.length; j++) {
            // Search the English translations
            const eCheck = " " + dictionary[i].t[j].e + " ";
            if (eCheck.includes(" " + query + " ") ||
                eCheck.includes(" " + query + ",")) {
                matches.push(dictionary[i]);
                continue outer;
            }
            // Search the German translation
            const gCheck = " " + dictionary[i].t[j].g + " ";
            if (gCheck.includes(" " + query + " ") ||
                gCheck.includes(" " + query + ",")) {
                matches.push(dictionary[i]);
                continue outer;
            }
        }
    }

    if (matches.length == 0) {
        document.title = "No result | Latinarium";
        content += "<div class=\"fs-4\"><i class=\"bi bi-exclamation-diamond\"></i> No results 🢝 Keine Treffer</div>";
    } else {
        content += "<span style=\"color:black\"><span class=\"fs-6\">" + matches.length + " result(s) • " + matches.length + " Treffer</span></span><br><br>";
        for (var i = 0; i < matches.length; i++) {
            //content += "<div class=\"result-div\"><span class=\"fw-bold\">" + matches[i].l + "</span>";
            content += "<div class=\"card result-card\"><div class=\"card-body\"><span class=\"fw-bold\">" + matches[i].l + "</span>";
            if (matches[i].c != "") {
                content += " <i>" + matches[i].c + "</i><br>";
            } else {
                content += "<br>";
            }

            if (matches[i].t.length > 0) {
                content += "<table class=\"table\"><tbody>"
                for (var j = 0; j < matches[i].t.length; j++) {
                    content += "<tr><td class=\"ps-0\">" + matches[i].t[j].e + "</td><td class=\"pe-0\">" + matches[i].t[j].g + "</tr>";
                }
                content += "</tbody></table>"
                //content = content.substring(0, content.length - 4);
            }
            if (matches[i].r.length > 0) {
                for (var j = 0; j < matches[i].r.length; j++) {
                    content += "<span class=\"references\">" + matches[i].r[j] + "</span>";
                }
                content += "<br>";
            }

            //content += "</div><br>";
            content += "</div></div><br>";
        }
    }
    contentDiv.innerHTML = content;
} else if (page == "help") {
    var content = "<img src=\"assets/help-entry.png\" class=\"img-fluid\">";
    contentDiv.innerHTML = content;
} else if (page == "references") {
    var content = "<table class=\"table table-hover table-borderless\">";
    for (var i = 0; i < references.length; i++) {
        content += "<tr><td>" + references[i].r + "</td><td>" + references[i].c + "</td><td>"
        if (references[i].l != "") {
            content += "<a target=\"_blank\" href=\"" + references[i].l + "\"><i class=\"bi bi-box-arrow-up-right\"></i></a>";
        }
        content += "</td></tr>";
    }
    content += "</table>";
    contentDiv.innerHTML = content;
} else {
    var content = "";
    content += "<table class=\"table table-borderless\"><tbody>";
    content += "<tr><td><b>Latinarium</b> is a Latin dictionary with English and German translations under way of development. Users should take into account that some functions do not yet work satisfactorily.</td>"
    content += "<td><b>Latinarium</b> ist ein lateinisches Wörterbuch mit englischen und deutschen Übersetzungen, das sich in der Entwicklung befindet. Bitte beachten Sie, dass einige Funktionen noch nicht zufriedenstellend funktionieren.</td></tr>"
    content += "<tr><td>This dictionary is being developed by a community on Github. You are welcome to contribute to the <a target=\"_blank\" href=\"https://github.com/latinarium/latinarium.github.io\">repository</a>.</td>"
    content += "<td>Dieses Wörterbuch wird von einer Community auf GitHub entwickelt. Sie sind herzlich dazu eingeladen, zum <a target=\"_blank\" href=\"https://github.com/latinarium/latinarium.github.io\">Repository</a> beizutragen.</td></tr>"
    content += "<tr><td>For advice on how to read and use this dictionary see <a href=\"?page=help\">Help</a>.</td>"
    content += "<td>Hinweise zum Verwenden dieses Wörterbuchs finden Sie in der <a href=\"?page=help\">Hilfe</a>.</td></tr>"
    content += "</tr></tbody></table>";
    contentDiv.innerHTML = content;
}

searchbar.addEventListener('keydown', function onEvent(event) {
    if (event.key === "Enter") {
        window.location.href = "?x=" + searchbar.value;
    }
    return false;
});

searchbar.onsearch = await(async () => {
    window.location.href = "?x=" + searchbar.value;
});

searchButton.addEventListener("click", () => {
    window.location.href = "?x=" + searchbar.value;
});
