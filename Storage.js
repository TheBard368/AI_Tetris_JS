/**
 * Storage.js – zapisywanie i wczytywanie najlepszych epok (generacji).
 *
 * Po każdej generacji najlepszy osobnik (jego wagi i wynik) trafia do listy zapisanej
 * w localStorage przeglądarki. Lista jest posortowana malejąco po przystosowaniu (fitness)
 * i przycięta do MAX_SAVED_EPOCHS pozycji, więc zawsze przechowuje najlepsze epoki
 * ze wszystkich treningów. Listę można też wyeksportować do pliku JSON i zaimportować
 * z powrotem (np. na innym komputerze lub przeglądarce).
 *
 * Format pojedynczego wpisu:
 *  { id, runId, generation, fitness, score, pieces, date, weights: { holes, chasms, ... } }
 */

const STORAGE_KEY = 'aiTetris.savedEpochs';
const MAX_SAVED_EPOCHS = 20;
const EXPORT_FILE_NAME = 'ai-tetris-epoki.json';

const ModelStorage = {

    //czy localStorage jest dostępny (może być zablokowany np. w trybie prywatnym)
    isAvailable(){
        try{
            localStorage.setItem(STORAGE_KEY + '.test', '1');
            localStorage.removeItem(STORAGE_KEY + '.test');
            return true;
        }catch(e){
            return false;
        }
    },

    //wszystkie zapisane epoki, od najlepszej
    load(){
        try{
            var raw = localStorage.getItem(STORAGE_KEY);
            var list = raw ? JSON.parse(raw) : [];
            return Array.isArray(list) ? list.map(normalizeEntry).filter(e => e) : [];
        }catch(e){
            console.warn("Nie udało się odczytać zapisanych epok", e);
            return [];
        }
    },

    //najlepsza zapisana epoka lub null
    getBest(){
        return this.load()[0] || null;
    },

    //zapisuje listę (sortuje, usuwa duplikaty i przycina do MAX_SAVED_EPOCHS)
    saveAll(list){
        var unique = new Map();
        list.forEach(e => unique.set(e.id, e));

        var sorted = Array.from(unique.values())
            .sort((a, b) => b.fitness - a.fitness)
            .slice(0, MAX_SAVED_EPOCHS);

        try{
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        }catch(e){
            console.warn("Nie udało się zapisać epok", e);
        }
        return sorted;
    },

    //dodaje wynik jednej epoki
    addEpoch(entry){
        return this.saveAll(this.load().concat([entry]));
    },

    clear(){
        try{
            localStorage.removeItem(STORAGE_KEY);
        }catch(e){ /* brak dostępu do localStorage – nie ma czego czyścić */ }
    },

    //pobiera plik JSON z zapisanymi epokami
    exportToFile(){
        var data = {
            app: 'AI_Tetris_JS',
            version: 1,
            exportedAt: new Date().toISOString(),
            epochs: this.load()
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = EXPORT_FILE_NAME;
        document.body.appendChild(link);
        link.click();
        link.remove();
        // zwalniamy adres z opóźnieniem, żeby przeglądarka zdążyła rozpocząć pobieranie
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    },

    /**
     * Wczytuje epoki z pliku JSON i dołącza je do zapisanych.
     * Akceptuje plik z eksportu ({epochs: [...]}), samą tablicę wpisów lub pojedynczy wpis.
     * @returns {Promise<number>} liczba poprawnie wczytanych wpisów
     */
    importFromFile(file){
        return file.text().then(text => {
            var data = JSON.parse(text);
            var list = Array.isArray(data) ? data : (Array.isArray(data.epochs) ? data.epochs : [data]);
            var imported = list.map(normalizeEntry).filter(e => e);
            if(imported.length == 0){
                throw new Error("Plik nie zawiera poprawnych wag modelu");
            }
            this.saveAll(this.load().concat(imported));
            return imported.length;
        });
    }
};

//sprawdza i uzupełnia wpis; zwraca null, gdy wpis nie zawiera poprawnych wag
function normalizeEntry(e, index){
    if(!e || typeof e != 'object' || !e.weights || typeof e.weights != 'object') return null;

    var weights = {};
    for(const name of WEIGHT_NAMES){
        var value = Number(e.weights[name]);
        if(!isFinite(value)) return null;
        weights[name] = value;
    }

    return {
        id: e.id ? String(e.id) : 'import-' + Date.now().toString(36) + '-' + index,
        runId: e.runId ? String(e.runId) : 'import',
        generation: Number(e.generation) || 0,
        fitness: Number(e.fitness) || 0,
        score: Number(e.score) || 0,
        pieces: Number(e.pieces) || 0,
        date: e.date || new Date().toISOString(),
        weights: weights
    };
}
