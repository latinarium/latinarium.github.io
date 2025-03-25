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
        if (dictionary[i].l == query) {
            matches.push(dictionary[i]);
            continue outer;
        }
        // Search all variants for each entry
        for (var j = 0; j < dictionary[i].v.length; j++) {
            if (dictionary[i].v[j] == query) {
                matches.push(dictionary[i]);
                continue outer;
            }
        }
        // Search all translations for each entry
        for (var j = 0; j < dictionary[i].t.length; j++) {
            // Search all English translations 
            for (var k = 0; k < dictionary[i].t[j].e.length; k++) {
                if (dictionary[i].t[j].e[k] == query) {
                    matches.push(dictionary[i]);
                    continue outer;
                }
            }
            // Search all German translations 
            for (var k = 0; k < dictionary[i].t[j].g.length; k++) {
                if (dictionary[i].t[j].g[k] == query) {
                    matches.push(dictionary[i]);
                    continue outer;
                }
            }
        }
    }

    content += "<span style=\"color:black\"><b>Community Dictionary of Latin Online</b><br><span class=\"fs-6\">The search for ‘" + query + "’ returned " + matches.length + " result(s).</span></span><br><br>";

    if (matches.length == 0) {
        document.title = "No result | Latinarium";
        content += "<div class=\"fs-4\"><i class=\"bi bi-exclamation-diamond\"></i> There are no results</div>";
    } else {
        for (var i = 0; i < matches.length; i++) {
            content += "<div class=\"result-div\">" + matches[i].l + " ";

            if (matches[i].f != "") {
                content += matches[i].f + " ";
            }

            if (matches[i].c != "") {
                content += "[" + matches[i].c + "]<br>";
            } else {
                content += "<br>";
            }

            if (matches[i].v.length > 0) {
                content += "<br><b>Variants</b><br>"
                for (var j = 0; j < matches[i].v.length; j++) {
                    content += matches[i].v[j] + ", ";
                }
                content = content.substring(0, content.length - 2);
                content += "<br>";
            }

            if (matches[i].n != "") {
                content += "<br><b>Notes</b><br>" + matches[i].n + "<br>";
            }

            if (matches[i].e != "") {
                content += "<br><b>Etymology</b><br>" + matches[i].e + "<br>";
            }

            if (matches[i].t.length > 0) {
                content += "<br><b>Translations</b><br><table class=\"table table-borderless result-table\">"
                for (var j = 0; j < matches[i].t.length; j++) {
                    content += "<tr><td class=\"translation-td\">" + matches[i].t[j].e + "</td><td class=\"translation-td\">" + matches[i].t[j].g + "</td></tr>";
                }
                content += "</table>";
            }

            if (matches[i].d.length > 0) {
                content += "<br><b>Derivatives</b><br>"
                for (var j = 0; j < matches[i].d.length; j++) {
                    content += matches[i].d[j] + ", ";
                }
                content = content.substring(0, content.length - 2);
                content += "<br>";
            }

            if (matches[i].r.length > 0) {
                content += "<br><b>References</b><br>"
                for (var j = 0; j < matches[i].r.length; j++) {
                    content += "<u class=\"references-u\"" + references[k].c + "\">" + matches[i].r[j] + "</u>  ";
                }
                content = content.substring(0, content.length - 2);
                content += "<br>";
            }
            
            content += "</div><br>";
        }
    }
    contentDiv.innerHTML = content;
} else if (page == "help") {
    var content = "<img src=\"assets/help-entry.png\" class=\"img-fluid\">";
    contentDiv.innerHTML = content;
} else if (page == "references") {
    var content = "<table class=\"table table-hover table-borderless\">";
    for (var i = 0; i < references.length; i++) {
        content += "<tr><td class=\"references-td\">" + references[i].r + "</td><td>" + references[i].c + "</td><td>"
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
