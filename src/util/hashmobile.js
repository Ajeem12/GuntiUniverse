import Hashids from "hashids";

const SECRET_KEY = import.meta.env.VITE_HASHIDS_SECRET || "default-secret-key";
const MIN_LENGTH = 8;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz123456789"; // cleaner

const hashmobile = new Hashids(SECRET_KEY, MIN_LENGTH, ALPHABET);

export default hashmobile;
