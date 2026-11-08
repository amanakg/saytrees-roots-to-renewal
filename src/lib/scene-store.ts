// Browser-only storage for the applied village animation (IndexedDB).
const DB = "saytrees-scene";
const STORE = "videos";
const KEY = "active";

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

export const saveSceneVideo = (blob: Blob) => tx("readwrite", (s) => s.put(blob, KEY));
export const loadSceneVideo = () => tx<Blob | undefined>("readonly", (s) => s.get(KEY));
export const clearSceneVideo = () => tx("readwrite", (s) => s.delete(KEY));
