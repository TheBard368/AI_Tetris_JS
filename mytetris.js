/**
 * mytetris.js – punkt wejścia aplikacji: menu startowe, pętla treningu / pokazu i pasek stanu.
 *
 * Tryby pracy:
 *  - 'train' – trening algorytmem genetycznym (od losowych wag albo od wczytanego modelu);
 *              po każdej epoce najlepszy osobnik jest zapisywany (Storage.js),
 *  - 'demo'  – wszystkie plansze grają tym samym, wczytanym modelem, bez ewolucji.
 */

const POP_COUNT = 8;    // liczba równoległych gier = liczba osobników (canvas mieści 4 x 2 plansze)

var games = [];
var population = null;
var loopId = null;          // uchwyt setInterval głównej pętli
var appMode = null;         // 'train' | 'demo' | null (menu)
var runId = null;           // identyfikator bieżącego treningu (rozróżnia zapisy z różnych treningów)
var movesPerTick = 1;       // ile ruchów wykonuje każde AI w jednym takcie pętli
var bestOfRun = null;       // najlepszy wynik w bieżącym treningu / pokazie
var lastEpoch = null;       // wynik ostatniej zakończonej epoki
var savedEpochs = [];       // lista zapisanych epok wyświetlana w menu

function $(id){
    return document.getElementById(id);
}


// ===================== PĘTLA GRY =====================

//tworzy nowe gry (po jednej na osobnika) i rysuje je
function setUpGames(){
    games.forEach(g => g.pause());
    games = [];
    for(var i=0; i<POP_COUNT; i++){
        games.push(new Game(i, false));
        drawGame(games[i]);
    }
}

function startLoop(){
    $('menu').classList.add('hidden');
    $('status').classList.remove('hidden');
    $('statusMessage').textContent = '';

    setUpGames();
    games.forEach(g => g.start());
    loopId = setInterval(tick, 0);
    updateStatus();
}

function stopLoop(){
    clearInterval(loopId);
    loopId = null;
    games.forEach(g => g.pause());
}

//jeden takt pętli – każde AI wykonuje `movesPerTick` ruchów
function tick(){
    for(var k=0; k<movesPerTick && loopId !== null; k++){
        if(population.allDead()){
            onRoundEnd();
        }
        else{
            population.useMoves(games);
        }
    }
    updateStatus();
}

//wszystkie gry się skończyły – koniec epoki
function onRoundEnd(){
    if(appMode == 'train'){
        recordEpoch();

        if(population.isFinished()){
            stopLoop();
            $('statusMessage').textContent = 'Trening zakończony – najlepsze epoki zapisano.';
            return;
        }
        population.selection();
    }
    else{
        rememberBest(population.findBest());
        population.resetAll();
    }

    games.forEach(g => g.reset());
}

//zapisuje najlepszego osobnika zakończonej epoki
function recordEpoch(){
    var best = population.findBest();
    var entry = {
        id: runId + '-' + population.generation,
        runId: runId,
        generation: population.generation,
        fitness: best.getFitness(),
        score: best.getScore(),
        pieces: best.getPieceCount(),
        date: new Date().toISOString(),
        weights: Object.assign({}, best.weights)
    };

    lastEpoch = entry;
    rememberBest(best, entry);
    ModelStorage.addEpoch(entry);
}

function rememberBest(phenotype, entry){
    if(!bestOfRun || phenotype.getFitness() > bestOfRun.fitness){
        bestOfRun = entry || {
            generation: population.generation,
            fitness: phenotype.getFitness(),
            score: phenotype.getScore()
        };
    }
}


// ===================== START TRYBÓW =====================

/**
 * Rozpoczyna trening.
 * @param {Object|null} seedEntry zapisana epoka, od której kontynuujemy (null = losowe wagi)
 */
function startTraining(seedEntry){
    var maxGenerations = Math.max(0, parseInt($('generationsInput').value, 10) || 0);

    population = new Population(POP_COUNT, maxGenerations, seedEntry ? seedEntry.weights : null, {
        startGeneration: seedEntry ? seedEntry.generation + 1 : 0
    });
    appMode = 'train';
    runId = Date.now().toString(36);
    bestOfRun = null;
    lastEpoch = null;
    startLoop();
}

//pokaz gry wczytanego modelu (bez ewolucji)
function startDemo(entry){
    population = new Population(POP_COUNT, 0, entry.weights, {exactCopies: true});
    appMode = 'demo';
    bestOfRun = null;
    lastEpoch = null;
    startLoop();
}

function backToMenu(){
    stopLoop();
    appMode = null;
    $('status').classList.add('hidden');
    $('menu').classList.remove('hidden');
    refreshSavedList();
}


// ===================== INTERFEJS =====================

function updateStatus(){
    if(!population) return;

    if(appMode == 'train'){
        $('statusMode').textContent = 'Trening';
        var limit = population.maxGenerations > 0 ? ' (' + population.generationsDone() + '/' + population.maxGenerations + ')' : '';
        $('statusGeneration').textContent = 'Epoka: ' + population.generation + limit;
    }
    else{
        $('statusMode').textContent = 'Pokaz modelu';
        $('statusGeneration').textContent = 'Runda: ' + (population.generation + 1);
    }

    $('statusAlive').textContent = 'Grające AI: ' + population.aliveCount() + '/' + POP_COUNT;

    var bestText = bestOfRun ? 'Rekord: ' + bestOfRun.score + ' pkt' : 'Rekord: –';
    if(lastEpoch) bestText += ' | Ostatnia epoka: ' + lastEpoch.score + ' pkt';
    $('statusBest').textContent = bestText;
}

//opis wpisu na liście zapisanych epok
function describeEntry(entry, index){
    var date = new Date(entry.date);
    var dateText = isNaN(date) ? '' : ' · ' + date.toLocaleString();
    return '#' + (index + 1) + ' · epoka ' + entry.generation + ' · ' + entry.score + ' pkt · ' + entry.pieces + ' klocków' + dateText;
}

//odświeża listę zapisanych epok w menu
function refreshSavedList(){
    savedEpochs = ModelStorage.load();
    var select = $('savedSelect');
    select.innerHTML = '';

    savedEpochs.forEach((entry, i) => {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = describeEntry(entry, i);
        select.appendChild(option);
    });

    var empty = savedEpochs.length == 0;
    select.disabled = empty;
    ['btnContinue', 'btnDemo', 'btnExport', 'btnClear'].forEach(id => $(id).disabled = empty);
    showSelectedInfo();
}

//pokazuje wagi wybranego modelu
function showSelectedInfo(){
    var entry = getSelectedEntry();
    if(!entry){
        $('savedInfo').textContent = 'Brak zapisanych epok. Uruchom trening – najlepszy osobnik każdej epoki zapisze się automatycznie.';
        return;
    }

    var lines = WEIGHT_NAMES.map(name => name.padEnd(20) + entry.weights[name].toFixed(2));
    $('savedInfo').textContent = 'Wagi modelu:\n' + lines.join('\n');
}

function getSelectedEntry(){
    return savedEpochs[parseInt($('savedSelect').value, 10)] || null;
}

//podpina obsługę przycisków
function setUpMenu(){
    if(!ModelStorage.isAvailable()){
        $('storageWarning').classList.remove('hidden');
    }

    $('btnNew').addEventListener('click', () => startTraining(null));
    $('btnContinue').addEventListener('click', () => {
        var entry = getSelectedEntry();
        if(entry) startTraining(entry);
    });
    $('btnDemo').addEventListener('click', () => {
        var entry = getSelectedEntry();
        if(entry) startDemo(entry);
    });
    $('savedSelect').addEventListener('change', showSelectedInfo);

    $('btnExport').addEventListener('click', () => ModelStorage.exportToFile());
    $('btnStatusExport').addEventListener('click', () => ModelStorage.exportToFile());
    $('btnImport').addEventListener('click', () => $('importFile').click());
    $('importFile').addEventListener('change', event => {
        var file = event.target.files[0];
        event.target.value = '';    // pozwala wczytać ten sam plik ponownie
        if(!file) return;

        ModelStorage.importFromFile(file)
            .then(count => {
                refreshSavedList();
                alert('Wczytano zapisów: ' + count);
            })
            .catch(err => alert('Nie udało się wczytać pliku: ' + err.message));
    });
    $('btnClear').addEventListener('click', () => {
        if(confirm('Usunąć wszystkie zapisane epoki?')){
            ModelStorage.clear();
            refreshSavedList();
        }
    });

    $('btnMenu').addEventListener('click', backToMenu);
    $('speedSelect').addEventListener('change', event => {
        movesPerTick = parseInt(event.target.value, 10) || 1;
    });

    refreshSavedList();
}


setUpGames();   // puste plansze w tle menu
setUpMenu();
