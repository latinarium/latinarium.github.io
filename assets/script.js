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
                    content += "<tr><td class=\"ps-0\">" + matches[i].t[j].e + "</td><td class=\"pe-0\">" + matches[i].t[j].g + "<tr>";
                }
                content += "</tbody></table>"
                //content = content.substring(0, content.length - 4);
            }
            if (matches[i].r.length > 0) {
                content += " "
                for (var j = 0; j < matches[i].r.length; j++) {
                    content += "<span class=\"references\">" + matches[i].r[j] + "</span>";
                }
                content = content.substring(0, content.length - 3);
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
    var content = "<h3>About</h3>Latinarium is a Latin dictionary with English and German translations under way of development. Users should take into account that some functions do not yet work satisfactorily. This dictionary is being developed by a community on Github. The project uses free and open software and is non-commercial. You are welcome to contribute to the <a target=\"_blank\" href=\"https://github.com/latinarium/latinarium.github.io\">repository</a>.";
    content += "<br><br>For advice on how to read and use this dictionary see <a href=\"?page=info\">Help</a>.";
    content += "<br><br><h3>Updates</h3><b>3/21/2025</b> Initial version released.";
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
