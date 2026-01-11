/**
 * Universal Dictionary Utility
 * 
 * Provides a centralized source for word validation and puzzle generation
 * across all games (GRIDGRAM, SHIFT, etc.)
 */

// Generation-ready words (familiar, common)
// Merged from Gridgram and SHIFT lists
export const GENERATION_WORDS: Record<number, string[]> = {
    3: [
        "ACE", "ACT", "ADD", "AGE", "AID", "AIM", "AIR", "ALL", "AND", "ANT",
        "ANY", "APE", "ARC", "ARE", "ARK", "ARM", "ART", "ASH", "ATE", "AWE",
        "AXE", "BAD", "BAG", "BAN", "BAR", "BAT", "BED", "BEE", "BET", "BIG",
        "BIN", "BIT", "BOW", "BOX", "BOY", "BUD", "BUG", "BUS", "BUT", "BUY",
        "CAB", "CAN", "CAP", "CAR", "CAT", "COB", "COD", "COG", "COP", "COO",
        "COT", "COW", "CRY", "CUB", "CUD", "CUP", "CUT", "DAB", "DAD", "DAM",
        "DAY", "DEN", "DEW", "DID", "DIG", "DIM", "DIP", "DOC", "DOE", "DOG",
        "DOT", "DRY", "DUB", "DUD", "DUE", "DUG", "DYE", "EAR", "EAT", "EEL",
        "EGG", "ELF", "ELK", "ELM", "EMU", "END", "ERA", "EVE", "EWE", "EYE",
        "FAN", "FAR", "FAT", "FAX", "FED", "FEE", "FEW", "FIG", "FIN", "FIR",
        "FIT", "FIX", "FLY", "FOB", "FOE", "FOG", "FOR", "FOX", "FRY", "FUN",
        "FUR", "GAB", "GAG", "GAP", "GAS", "GEL", "GEM", "GET", "GIG", "GIN",
        "GNU", "GOB", "GOD", "GOT", "GUM", "GUN", "GUT", "GUY", "GYM", "HAD",
        "HAM", "HAS", "HAT", "HAY", "HEM", "HEN", "HER", "HEW", "HID", "HIM",
        "HIP", "HIS", "HIT", "HOB", "HOG", "HOP", "HOT", "HOW", "HUB", "HUE",
        "HUG", "HUM", "HUT", "ICE", "ICY", "ILL", "IMP", "INK", "INN", "ION",
        "IRE", "ITS", "IVY", "JAB", "JAM", "JAR", "JAW", "JAY", "JET", "JIG",
        "JOB", "JOG", "JOT", "JOY", "JUG", "JUT", "KEG", "KEN", "KEY", "KID",
        "KIN", "KIT", "LAB", "LAD", "LAG", "LAP", "LAW", "LAY", "LEA", "LED",
        "LEG", "LET", "LID", "LIE", "LIP", "LIT", "LOG", "LOT", "LOW", "LUG",
        "MAD", "MAN", "MAP", "MAR", "MAT", "MAW", "MAY", "MEN", "MET", "MIX",
        "MOB", "MOM", "MOP", "MOW", "MUD", "MUG", "NAB", "NAG", "NAP", "NET",
        "NEW", "NIL", "NIP", "NIT", "NOD", "NOR", "NOT", "NOW", "NUB", "NUN",
        "NUT", "OAK", "OAR", "OAT", "ODD", "ODE", "OFF", "OFT", "OHM", "OIL",
        "OLD", "ONE", "OPT", "ORB", "ORE", "OUR", "OUT", "OWE", "OWL", "OWN",
        "PAD", "PAL", "PAN", "PAT", "PAW", "PAY", "PEA", "PEG", "PEN", "PEP",
        "PER", "PET", "PEW", "PIE", "PIG", "PIN", "PIT", "PLY", "POD", "POP",
        "POT", "PRY", "PUB", "PUG", "PUN", "PUP", "PUS", "PUT", "RAG", "RAM",
        "RAN", "RAP", "RAT", "RAW", "RAY", "RED", "REF", "RIB", "RID", "RIG",
        "RIM", "RIP", "ROB", "ROD", "ROE", "ROT", "ROW", "RUB", "RUG", "RUN",
        "RUT", "RYE", "SAC", "SAD", "SAG", "SAP", "SAT", "SAW", "SAX", "SAY",
        "SEA", "SET", "SEW", "SHE", "SHY", "SIN", "SIP", "SIR", "SIS", "SIT",
        "SIX", "SKI", "SKY", "SLY", "SOB", "SOD", "SON", "SOP", "SOT", "SOW",
        "SOY", "SPA", "SPY", "STY", "SUB", "SUM", "SUN", "SUP", "TAB", "TAD",
        "TAG", "TAN", "TAP", "TAR", "TAT", "TAX", "TEA", "TEN", "THE", "TIC",
        "TIE", "TIN", "TIP", "TOE", "TON", "TOO", "TOP", "TOT", "TOW", "TOY",
        "TRY", "TUB", "TUG", "TWO", "URN", "USE", "VAN", "VAT", "VET", "VIA",
        "VIE", "VOW", "WAD", "WAG", "WAR", "WAS", "WAX", "WAY", "WEB", "WED",
        "WEE", "WET", "WHO", "WHY", "WIG", "WIN", "WIT", "WOE", "WOK", "WON",
        "WOO", "WOW", "YAK", "YAM", "YAP", "YAW", "YEA", "YES", "YET", "YEW",
        "YIN", "YOU", "ZAP", "ZEN", "ZIP", "ZIT", "ZOO"
    ],
    4: [
        "ABLE", "ACHE", "ACID", "AGED", "AIDE", "ALLY", "ALSO", "AMID", "ANTI",
        "ARCH", "AREA", "ARMY", "AUNT", "AUTO", "BABE", "BABY", "BACK", "BAIT",
        "BAKE", "BALD", "BALL", "BAND", "BANK", "BARE", "BARK", "BARN", "BASE",
        "BATH", "BEAD", "BEAK", "BEAM", "BEAN", "BEAR", "BEAT", "BEEF", "BEEN",
        "BEER", "BELL", "BELT", "BEND", "BENT", "BEST", "BIKE", "BILL", "BIND",
        "BIRD", "BITE", "BLOW", "BLUE", "BOAT", "BODY", "BOIL", "BOLD", "BOLT",
        "BOMB", "BOND", "BONE", "BOOK", "BOOM", "BOOT", "BORE", "BORN", "BOSS",
        "BOTH", "BOWL", "BROW", "BUCK", "BULK", "BULL", "BUMP", "BURN", "BURY",
        "BUSH", "BUSY", "CAFE", "CAGE", "CAKE", "CALF", "CALL", "CALM", "CAME",
        "CAMP", "CANE", "CAPE", "CARD", "CARE", "CART", "CASE", "CASH", "CAST",
        "CAVE", "CELL", "CHAT", "CHEF", "CHEW", "CHIN", "CHIP", "CHOP", "CITE",
        "CITY", "CLAD", "CLAM", "CLAP", "CLAW", "CLAY", "CLIP", "CLUB", "CLUE",
        "COAL", "COAT", "CODE", "COIL", "COIN", "COLD", "COLE", "COLT", "COMB",
        "COME", "CONE", "COOK", "COOL", "COPE", "COPY", "CORD", "CORE", "CORK",
        "CORN", "COST", "COZY", "CRAB", "CREW", "CROP", "CROW", "CUBE", "CULT",
        "CURB", "CURE", "CURL", "CUTE", "DAME", "DAMP", "DARE", "DARK", "DART",
        "DASH", "DATA", "DATE", "DAWN", "DAYS", "DEAD", "DEAF", "DEAL", "DEAN",
        "DEAR", "DEBT", "DECK", "DEED", "DEEM", "DEEP", "DEER", "DEMO", "DENT",
        "DENY", "DESK", "DIAL", "DICE", "DIET", "DIME", "DINE", "DIRE", "DIRT",
        "DISH", "DISK", "DIVE", "DOCK", "DOES", "DOLL", "DOME", "DONE", "DOOM",
        "DOOR", "DOSE", "DOWN", "DRAG", "DRAW", "DREW", "DRIP", "DROP", "DRUG",
        "DRUM", "DUAL", "DUCK", "DUDE", "DUEL", "DUKE", "DULL", "DUMB", "DUMP",
        "DUNE", "DUSK", "DUST", "DUTY", "EACH", "EARL", "EARN", "EARS", "EASE",
        "EAST", "EASY", "EDGE", "EDIT", "ELSE", "EMIT", "ENDS", "EPIC", "EVEN",
        "EVER", "EXAM", "EXEC", "EXIT", "EYES", "FACE", "FACT", "FADE", "FAIL",
        "FAIR", "FAKE", "FALL", "FAME", "FANS", "FARE", "FARM", "FAST", "FATE",
        "FEAR", "FEAT", "FEED", "FEEL", "FEET", "FELL", "FELT", "FERN", "FEST",
        "FEUD", "FILE", "FILL", "FILM", "FIND", "FINE", "FIRE", "FIRM", "FISH",
        "FIST", "FIVE", "FLAG", "FLAP", "FLAT", "FLAW", "FLEA", "FLED", "FLEE",
        "FLEW", "FLIP", "FLOW", "FLUX", "FOAM", "FOES", "FOIL", "FOLD", "FOLK",
        "FOND", "FONT", "FOOD", "FOOL", "FOOT", "FORD", "FORE", "FORK", "FORM",
        "FORT", "FOUL", "FOUR", "FOWL", "FREE", "FROG", "FROM", "FUEL", "FULL",
        "FUME", "FUND", "FUSE", "FUSS", "GAIN", "GALE", "GAME", "GANG", "GATE",
        "GAVE", "GAZE", "GEAR", "GENE", "GIFT", "GIRL", "GIVE", "GLAD", "GLEE",
        "GLEN", "GLOW", "GLUE", "GOAT", "GOES", "GOLD", "GOLF", "GONE", "GOOD",
        "GOWN", "GRAB", "GRAM", "GRAY", "GREW", "GREY", "GRID", "GRIM", "GRIN",
        "GRIP", "GRIT", "GROW", "GULF", "GURU", "GUST", "GUYS", "HACK", "HAIL",
        "HAIR", "HALE", "HALF", "HALL", "HALT", "HAND", "HANG", "HARD", "HARE",
        "HARM", "HARP", "HATE", "HAUL", "HAVE", "HAWK", "HEAD", "HEAL", "HEAP",
        "HEAR", "HEAT", "HEED", "HEEL", "HELD", "HELL", "HELM", "HELP", "HERB",
        "HERD", "HERE", "HERO", "HIDE", "HIGH", "HIKE", "HILL", "HINT", "HIRE",
        "HOLD", "HOLE", "HOLY", "HOME", "HOOD", "HOOK", "HOPE", "HORN", "HOSE",
        "HOST", "HOUR", "HOWL", "HUGE", "HULL", "HUNG", "HUNT", "HURT", "HYMN",
        "ICKY", "ICON", "IDEA", "IDLE", "INCH", "INTO", "IRON", "ISLE", "ITEM",
        "JACK", "JADE", "JAIL", "JAZZ", "JEAN", "JERK", "JEST", "JOBS", "JOIN",
        "JOKE", "JOLT", "JUMP", "JUNE", "JUNK", "JURY", "JUST", "KEEN", "KEEP",
        "KELP", "KEPT", "KEYS", "KICK", "KIDS", "KILL", "KIND", "KING", "KITE",
        "KNEE", "KNEW", "KNIT", "KNOB", "KNOT", "KNOW", "LACE", "LACK", "LADE",
        "LAID", "LAKE", "LAMB", "LAME", "LAMP", "LAND", "LANE", "LARD", "LARK",
        "LASH", "LASS", "LAST", "LATE", "LAWN", "LAWS", "LAYS", "LEAD", "LEAF",
        "LEAK", "LEAN", "LEAP", "LEFT", "LEND", "LENS", "LESS", "LIAR", "LICE",
        "LICK", "LIED", "LIES", "LIFE", "LIFT", "LIKE", "LILY", "LIMB", "LIME",
        "LIMP", "LINE", "LINK", "LINT", "LION", "LIPS", "LIST", "LIVE", "LOAD",
        "LOAF", "LOAN", "LOCK", "LOFT", "LOGO", "LONE", "LONG", "LOOK", "LOOM",
        "LOOP", "LORD", "LORE", "LOSE", "LOSS", "LOST", "LOTS", "LOUD", "LOVE",
        "LUCK", "LUMP", "LUNG", "LURE", "LURK", "LUSH", "LUST", "MADE", "MAID",
        "MAIL", "MAIN", "MAKE", "MALE", "MALL", "MALT", "MANE", "MANY", "MAPS",
        "MARK", "MARS", "MART", "MASH", "MASK", "MASS", "MAST", "MATE", "MATH",
        "MAZE", "MEAL", "MEAN", "MEAT", "MEEK", "MEET", "MELT", "MEMO", "MENU",
        "MERE", "MESH", "MESS", "MILD", "MILE", "MILK", "MILL", "MIME", "MIND",
        "MINE", "MINT", "MIRE", "MISS", "MIST", "MITE", "MITT", "MOAN", "MOAT",
        "MOCK", "MODE", "MOLD", "MOLE", "MOLT", "MONK", "MOOD", "MOON", "MOOR",
        "MORE", "MORN", "MOSS", "MOST", "MOTH", "MOVE", "MUCH", "MUCK", "MULE",
        "MULL", "MUSE", "MUSH", "MUST", "MUTE", "MYTH", "NAIL", "NAME", "NAPE",
        "NAVY", "NEAR", "NEAT", "NECK", "NEED", "NEON", "NEST", "NEWS", "NEXT",
        "NICE", "NICK", "NINE", "NODE", "NONE", "NOON", "NORM", "NOSE", "NOTE",
        "NOUN", "OAKS", "OATH", "OBEY", "ODDS", "OILS", "OILY", "OKAY", "OMEN",
        "OMIT", "ONCE", "ONES", "ONLY", "ONTO", "OPEN", "OPTS", "ORAL", "ORBS",
        "ORCA", "ORES", "OVEN", "OVER", "OWED", "OWES", "OWLS", "OWNS", "PACE",
        "PACK", "PACT", "PAGE", "PAID", "PAIL", "PAIN", "PAIR", "PALE", "PALM",
        "PANE", "PANG", "PANS", "PANT", "PARK", "PART", "PASS", "PAST", "PATH",
        "PAVE", "PAWN", "PAYS", "PEAK", "PEAR", "PEAS", "PEAT", "PECK", "PEEK",
        "PEEL", "PEER", "PENS", "PERK", "PERM", "PEST", "PETS", "PICK", "PIER",
        "PIES", "PIKE", "PILE", "PILL", "PINE", "PINK", "PINS", "PINT", "PIPE",
        "PITS", "PITY", "PLAN", "PLAY", "PLEA", "PLOD", "PLOP", "PLOT", "PLOW",
        "PLOY", "PLUG", "PLUM", "PLUS", "PODS", "POEM", "POET", "POKE", "POLE",
        "POLL", "POLO", "POMP", "POND", "PONY", "POOL", "POOP", "POOR", "POPE",
        "POPS", "PORE", "PORK", "PORT", "POSE", "POST", "POTS", "POUR", "PRAY",
        "PREP", "PREY", "PRIM", "PROB", "PROD", "PROP", "PROW", "PUFF", "PULL",
        "PULP", "PUMP", "PUNK", "PURE", "PUSH", "QUAY", "ROCK"
    ],
    5: [
        "ABIDE", "ABOUT", "ABOVE", "ABUSE", "ACIDS", "ACRES", "ACTED", "ACTOR",
        "ACUTE", "ADAPT", "ADDED", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
        "AGENT", "AGING", "AGONY", "AGREE", "AHEAD", "AIMED", "ALARM", "ALBUM",
        "ALERT", "ALIKE", "ALIVE", "ALLEY", "ALLOT", "ALLOW", "ALLOY", "ALONE",
        "ALONG", "ALOOF", "ALPHA", "ALTAR", "ALTER", "AMBER", "AMEND", "AMPLE",
        "ANGEL", "ANGER", "ANGLE", "ANGRY", "ANKLE", "ANNEX", "ANTIC", "APART",
        "APPLE", "APPLY", "APRON", "ARENA", "ARGUE", "ARISE", "ARMED", "ARMOR",
        "AROMA", "AROSE", "ARRAY", "ARROW", "ASHES", "ASIDE", "ASKED", "ASSET",
        "ATLAS", "ATTIC", "AUDIO", "AUDIT", "AWAIT", "AWAKE", "AWARD", "AWARE",
        "AWFUL", "BACKS", "BACON", "BADGE", "BADLY", "BAKER", "BALLS", "BANDS",
        "BANKS", "BARON", "BASED", "BASES", "BASIC", "BASIN", "BASIS", "BATCH",
        "BEACH", "BEADS", "BEANS", "BEARD", "BEARS", "BEAST", "BEGAN", "BEGIN",
        "BEGUN", "BEING", "BELLY", "BELOW", "BENCH", "BERRY", "BILLS", "BIRDS",
        "BIRTH", "BLACK", "BLADE", "BLAME", "BLAND", "BLANK", "BLAST", "BLAZE",
        "BLEAK", "BLEED", "BLEND", "BLESS", "BLIND", "BLINK", "BLISS", "BLOCK",
        "BLOND", "BLOOD", "BLOOM", "BLOWN", "BLUES", "BLUFF", "BLUNT", "BLURB",
        "BLURT", "BLUSH", "BOARD", "BOAST", "BOATS", "BOGUS", "BONDS", "BONES",
        "BONUS", "BOOKS", "BOOST", "BOOTH", "BOOTS", "BOUND", "BOXER", "BRAIN",
        "BRAKE", "BRAND", "BRASS", "BRAVE", "BREAD", "BREAK", "BREED", "BRICK",
        "BRIDE", "BRIEF", "BRING", "BRINK", "BRISK", "BROAD", "BROKE", "BROOK",
        "BROOM", "BROTH", "BROWN", "BRUSH", "BRUTE", "BUILD", "BUILT", "BUNCH",
        "BURST", "BUYER", "CABIN", "CABLE", "CADET", "CAKES", "CALLS", "CAMEL",
        "CAMPS", "CANAL", "CANDY", "CANON", "CARDS", "CARGO", "CARRY", "CARVE",
        "CASES", "CATCH", "CATER", "CAUSE", "CAVES", "CEASE", "CELLS", "CHAIN",
        "CHAIR", "CHALK", "CHAMP", "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP",
        "CHEAT", "CHECK", "CHEEK", "CHEER", "CHESS", "CHEST", "CHICK", "CHIEFS",
        "CHILD", "CHILL", "CHINA", "CHIPS", "CHOIR", "CHORD", "CHORE", "CHOSE",
        "CHUNK", "CHURN", "CIGAR", "CINCH", "CIRCA", "CITED", "CIVIC", "CIVIL",
        "CLAIM", "CLAMP", "CLANG", "CLASH", "CLASP", "CLASS", "CLAWS", "CLEAN",
        "CLEAR", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLING", "CLIPS", "CLOAK",
        "CLOCK", "CLONE", "CLOSE", "CLOTH", "CLOUD", "CLOWN", "CLUBS", "CLUCK",
        "CLUED", "CLUES", "CLUMP", "CLUNG", "COACH", "COAST", "COATS", "CODED",
        "CODES", "COINS", "COLOR", "COMET", "COMIC", "COMMA", "CONDO", "CORAL",
        "COUCH", "COUGH", "COULD", "COUNT", "COUPE", "COURT", "COVER", "CRACK",
        "CRAFT", "CRAMP", "CRANE", "CRASH", "CRAWL", "CRAZE", "CRAZY", "CREAK",
        "CREAM", "CREEK", "CREEP", "CREST", "CRICK", "CRIED", "CRIME", "CRISP",
        "CROAK", "CROCK", "CROOK", "CROPS", "CROSS", "CROWD", "CROWN", "CRUDE",
        "CRUEL", "CRUSH", "CRUST", "CUBIC", "CURED", "CURLY", "CURRY", "CURSE",
        "CURVE", "CYCLE", "ROCKS"
    ],
    6: [
        "ACCEPT", "ACCESS", "ACROSS", "ACTION", "ACTIVE", "ACTUAL", "ADVISE",
        "AFFORD", "AFRAID", "AGENCY", "AGENTS", "AGREED", "ALIENS", "ALMOST",
        "ALWAYS", "AMOUNT", "ANCHOR", "ANGELS", "ANIMAL", "ANNUAL", "ANSWER",
        "APPEAL", "APPEAR", "ARMIES", "AROUND", "ARREST", "ARRIVE", "ARTIST",
        "ASPECT", "ASSERT", "ASSESS", "ASSIST", "ASSUME", "ASSURE", "ATTACH",
        "ATTACK", "ATTEND", "AUTHOR", "AVENUE", "BACKUP", "BADGES", "BAKING",
        "BANANA", "BANKER", "BARELY", "BARREL", "BASKET", "BATTLE", "BEACON",
        "BEAUTY", "BECAME", "BECOME", "BEFORE", "BEGINS", "BEHALF", "BEHIND",
        "BEINGS", "BELIEF", "BELONG", "BESIDE", "BETTER", "BEYOND", "BISHOP",
        "BLAMED", "BLANKS", "BLAZED", "BLOCKS", "BLOODY", "BOARDS", "BODIES",
        "BOILED", "BONDED", "BORDER", "BORING", "BORROW", "BOTTLE", "BOTTOM",
        "BOUGHT", "BOUNCE", "BOUNDS", "BRANCH", "BRANDS", "BREACH", "BREAKS",
        "BREATH", "BREEDS", "BRICKS", "BRIDGE", "BRIGHT", "BRINGS", "BROKEN",
        "BROKER", "BRONZE", "BROWSE", "BRUTAL", "BUBBLE", "BUCKET", "BUDGET",
        "BUFFET", "BUILDS", "BULLET", "BUNDLE", "BURDEN", "BUREAU", "BURIED",
        "BURNED", "BURNER", "BUTTON", "BUYERS", "BUYING", "CABINS", "CABLES",
        "CALLED", "CALLER", "CAMERA", "CAMPOS", "CANADA", "CANCEL", "CANCER",
        "CANDLE", "CANNON", "CANNOT", "CANVAS", "CARBON", "CAREER", "CARPET",
        "CARVED", "CASUAL", "CAUGHT", "CAUSED", "CAUSAL", "CEMENT", "CENTER",
        "CHANGE", "CHARGE", "CHARTS", "CHEESE", "CHERRY", "CHESTS", "CHIEFS",
        "CHOICE", "CHOOSE", "CHOSEN", "CHURCH", "CIRCLE", "CITIES", "CLAIMS",
        "CLASSY", "CLAUSE", "CLEARS", "CLERGY", "CLEVER", "CLIENT", "CLINIC",
        "CLOCKS", "CLOSED", "CLOSER", "CLOSES", "CLOSET", "CLOTHS", "CLOUDS",
        "CLOUDY", "CLOVER", "COARSE", "COASTS", "COBALT", "COFFEE", "COLLAR",
        "COLONY", "COLORS", "COLUMN", "COMBAT", "COMING", "COMMIT", "COMMON"
    ],
    7: [
        "ABANDON", "ABILITY", "ABOLISH", "ABSENCE", "ABSOLVE", "ABSORBS", "ABSTAIN",
        "ACADEMY", "ACCEPTS", "ACCOUNT", "ACCUSES", "ACHIEVE", "ACQUIRE", "ACTIONS",
        "ACTRESS", "ADAPTED", "ADDRESS", "ADJOURN", "ADOPTED", "ADVANCE", "ADVERSE",
        "ADVISED", "ADVISER", "ADVISOR", "AFFAIRS", "AFFECTS", "AFFIXED", "AGAINST",
        "AGENDAS", "AGREEED", "AIRCAFT", "AIRPORT", "ALARMED", "ALCOHOL", "ALLEGED",
        "ALLOWED", "ALREADY", "ALTERED", "AMATEUR", "AMAZING", "AMBIENT", "AMENDED",
        "AMERICA", "AMONGST", "AMOUNTS", "ANCIENT", "ANGULAR", "ANIMALS", "ANNOYED",
        "ANOTHER", "ANSWERS", "ANTENNA", "ANTIQUE", "ANXIETY", "ANXIOUS", "ANYTIME",
        "APOLOGY", "APPAREL", "APPEARS", "APPLIED", "APPROVE", "ARCHIVE", "ARGUING",
        "ARISING", "ARRANGE", "ARREARS", "ARRIVAL", "ARRIVED", "ARTICLE", "ARTISTS",
        "ARTWORK", "ASSAULT", "ASSURED", "ASSUMED", "ATHLETE", "ATOMICS", "ATTACKS",
        "ATTEMPT", "ATTRACT", "AUCTION", "AUDITOR", "AUTHORS", "AUTOPSY", "AVERAGE",
        "AVOIDED", "AWAITED", "AWARDED", "BALANCE", "BANKING", "BARGAIN", "BARRIER",
        "BATTERY", "BEACHES", "BEARING", "BEATING", "BECAUSE", "BECOMES", "BEDROOM",
        "BELIEFS", "BELIEVE", "BELONGS", "BELOVED", "BENEATH", "BENEFIT"
    ]
};

import VALIDATION_WORDS_ARRAY from './dictionary_data.json';

// Comprehensive Validation Set (170,000+ words from Enable1)
const validationWords = new Set<string>(VALIDATION_WORDS_ARRAY.map(w => w.toUpperCase()));

/**
 * Check if a word is valid according to the universal dictionary
 */
export function isValidWord(word: string): boolean {
    return validationWords.has(word.toUpperCase());
}

/**
 * Get random words of target length for puzzle generation
 */
export function getRandomWords(count: number, length: number, random: () => number = Math.random): string[] {
    const list = GENERATION_WORDS[length];
    if (!list) return [];

    const shuffled = [...list].sort(() => random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Get all generation-ready words of a specific length
 */
export function getWordsOfLength(length: number): string[] {
    return GENERATION_WORDS[length] || [];
}

// Very common 4-letter words for SHIFT Easy mode
// Curated to include only words everyone knows
export const EASY_4_WORDS = [
    "BACK", "BALL", "BANK", "BEAR", "BEAT", "BEEN", "BELL", "BEST", "BIKE", "BIRD",
    "BLUE", "BOAT", "BODY", "BOOK", "BORN", "BOSS", "BOTH", "BOWL", "BURN", "BUSH",
    "BUSY", "CAGE", "CAKE", "CALL", "CALM", "CAME", "CAMP", "CARD", "CARE", "CART",
    "CASE", "CASH", "CAST", "CAVE", "CHEF", "CHIN", "CHIP", "CITY", "CLUB", "CLUE",
    "COAT", "CODE", "COIN", "COLD", "COME", "COOK", "COOL", "COPY", "CORE", "CORN",
    "COST", "CREW", "CROP", "CUBE", "CURE", "CURL", "CUTE", "DARE", "DARK", "DATA",
    "DATE", "DAWN", "DAYS", "DEAD", "DEAL", "DEAR", "DEEP", "DEER", "DESK", "DICE",
    "DIRT", "DISH", "DOCK", "DOES", "DOLL", "DONE", "DOOR", "DOWN", "DRAG", "DRAW",
    "DREW", "DROP", "DRUG", "DRUM", "DUCK", "DUDE", "DUKE", "DUMP", "DUST", "EACH",
    "EARN", "EARS", "EASE", "EAST", "EASY", "EDGE", "EDIT", "ELSE", "ENDS", "EVEN",
    "EVER", "EXIT", "EYES", "FACE", "FACT", "FADE", "FAIL", "FAIR", "FAKE", "FALL",
    "FAME", "FARM", "FAST", "FATE", "FEAR", "FEED", "FEEL", "FEET", "FELL", "FELT",
    "FILE", "FILL", "FILM", "FIND", "FINE", "FIRE", "FIRM", "FISH", "FIST", "FIVE",
    "FLAG", "FLAT", "FLEW", "FLOW", "FOAM", "FOLD", "FOLK", "FOOD", "FOOL", "FOOT",
    "FORD", "FORK", "FORM", "FORT", "FOUR", "FREE", "FROG", "FROM", "FUEL", "FULL",
    "FUND", "GAIN", "GAME", "GANG", "GATE", "GAVE", "GEAR", "GIFT", "GIRL", "GIVE",
    "GLAD", "GLOW", "GLUE", "GOAT", "GOES", "GOLD", "GOLF", "GONE", "GOOD", "GRAB",
    "GRAY", "GREW", "GRID", "GRIN", "GRIP", "GROW", "GUYS", "HACK", "HAIL", "HAIR",
    "HALF", "HALL", "HAND", "HANG", "HARD", "HARM", "HATE", "HAVE", "HAWK", "HEAD",
    "HEAL", "HEAR", "HEAT", "HELD", "HELL", "HELP", "HERB", "HERD", "HERE", "HERO",
    "HIDE", "HIGH", "HIKE", "HILL", "HINT", "HIRE", "HOLD", "HOLE", "HOME", "HOOD",
    "HOOK", "HOPE", "HORN", "HOST", "HOUR", "HUGE", "HUNG", "HUNT", "HURT", "ICON",
    "IDEA", "INTO", "IRON", "ITEM", "JACK", "JAIL", "JAZZ", "JEAN", "JOBS", "JOIN",
    "JOKE", "JUMP", "JUNE", "JUNK", "JURY", "JUST", "KEEN", "KEEP", "KEPT", "KEYS",
    "KICK", "KIDS", "KILL", "KIND", "KING", "KISS", "KITE", "KNEE", "KNEW", "KNOB",
    "KNOW", "LACK", "LAID", "LAKE", "LAMB", "LAMP", "LAND", "LANE", "LASH", "LAST",
    "LATE", "LAWN", "LAWS", "LEAD", "LEAF", "LEAK", "LEAN", "LEAP", "LEFT", "LEND",
    "LENS", "LESS", "LIAR", "LICK", "LIFE", "LIFT", "LIKE", "LIMB", "LIME", "LINE",
    "LINK", "LION", "LIPS", "LIST", "LIVE", "LOAD", "LOAF", "LOAN", "LOCK", "LOGO",
    "LONE", "LONG", "LOOK", "LORD", "LOSE", "LOSS", "LOST", "LOUD", "LOVE", "LUCK",
    "LUNG", "MADE", "MAID", "MAIL", "MAIN", "MAKE", "MALE", "MALL", "MANY", "MAPS",
    "MARK", "MARS", "MASK", "MASS", "MATE", "MATH", "MAZE", "MEAL", "MEAN", "MEAT",
    "MEET", "MELT", "MENU", "MILE", "MILK", "MILL", "MIND", "MINE", "MINT", "MISS",
    "MODE", "MOLD", "MONK", "MOOD", "MOON", "MORE", "MOST", "MOTH", "MOVE", "MUCH",
    "MULE", "MUST", "MYTH", "NAIL", "NAME", "NAVY", "NEAR", "NEAT", "NECK", "NEED",
    "NEST", "NEWS", "NEXT", "NICE", "NINE", "NODE", "NONE", "NOON", "NORM", "NOSE",
    "NOTE", "NOUN", "OBEY", "ODDS", "OKAY", "ONCE", "ONES", "ONLY", "ONTO", "OPEN",
    "OVEN", "OVER", "OWED", "OWES", "OWNS", "PACE", "PACK", "PAGE", "PAID", "PAIN",
    "PAIR", "PALE", "PALM", "PARK", "PART", "PASS", "PAST", "PATH", "PEAK", "PEAR",
    "PEAS", "PICK", "PIER", "PILE", "PILL", "PINE", "PINK", "PIPE", "PITY", "PLAN",
    "PLAY", "PLOT", "PLOW", "PLUG", "PLUS", "POEM", "POET", "POKE", "POLE", "POLL",
    "POND", "PONY", "POOL", "POOR", "POPE", "PORK", "PORT", "POSE", "POST", "POUR",
    "PRAY", "PREP", "PREY", "PUFF", "PULL", "PUMP", "PURE", "PUSH", "QUIT", "RACE",
    "RAFT", "RAGE", "RAID", "RAIL", "RAIN", "RAMP", "RANG", "RANK", "RARE", "RATE",
    "READ", "REAL", "REAR", "RENT", "REST", "RICE", "RICH", "RIDE", "RING", "RISE",
    "RISK", "ROAD", "ROAR", "ROBE", "ROCK", "RODE", "ROLE", "ROLL", "ROOF", "ROOM",
    "ROOT", "ROPE", "ROSE", "RUBY", "RUDE", "RUIN", "RULE", "RUSH", "RUST", "SAFE",
    "SAGA", "SAID", "SAIL", "SAKE", "SALE", "SALT", "SAME", "SAND", "SANE", "SANG",
    "SANK", "SAVE", "SEAL", "SEAT", "SEED", "SEEK", "SEEM", "SEEN", "SELF", "SELL",
    "SEND", "SENT", "SHED", "SHIN", "SHIP", "SHOE", "SHOP", "SHOT", "SHOW", "SHUT",
    "SICK", "SIDE", "SIGH", "SIGN", "SILK", "SING", "SINK", "SITE", "SIZE", "SKIN",
    "SLIP", "SLOW", "SNAP", "SNOW", "SOAK", "SOAP", "SOAR", "SOCK", "SOFA", "SOFT",
    "SOIL", "SOLD", "SOLE", "SOME", "SONG", "SOON", "SORT", "SOUL", "SOUP", "SOUR",
    "SPIN", "SPOT", "STAR", "STAY", "STEM", "STEP", "STIR", "STOP", "SUCH", "SUIT",
    "SURE", "SWAP", "SWIM", "TAIL", "TAKE", "TALE", "TALK", "TALL", "TANK", "TAPE",
    "TASK", "TEAM", "TEAR", "TEEN", "TELL", "TEND", "TENT", "TERM", "TEST", "TEXT",
    "THAN", "THAT", "THEM", "THEN", "THEY", "THIN", "THIS", "THUS", "TIDE", "TIED",
    "TIER", "TILE", "TIME", "TINY", "TIPS", "TIRE", "TOLD", "TONE", "TOOK", "TOOL",
    "TOPS", "TORE", "TORN", "TOUR", "TOWN", "TRAP", "TRAY", "TREE", "TRIM", "TRIO",
    "TRIP", "TRUE", "TUBE", "TUNE", "TURN", "TWIN", "TYPE", "UNIT", "UPON", "USED",
    "USER", "VARY", "VAST", "VERY", "VIEW", "VOTE", "WAGE", "WAIT", "WAKE", "WALK",
    "WALL", "WANT", "WARD", "WARM", "WARN", "WASH", "WAVE", "WAYS", "WEAK", "WEAR",
    "WEEK", "WELL", "WENT", "WERE", "WEST", "WHAT", "WHEN", "WHOM", "WIDE", "WIFE",
    "WILD", "WILL", "WIND", "WINE", "WING", "WIRE", "WISE", "WISH", "WITH", "WOLF",
    "WOKE", "WOOD", "WOOL", "WORD", "WORE", "WORK", "WORM", "WORN", "WRAP", "YARD",
    "YEAH", "YEAR", "YELL", "YOUR", "ZERO", "ZONE", "ZOOM"
];

/**
 * Get random easy words for SHIFT Easy mode (very common 4-letter words)
 */
export function getEasyWords(count: number, random: () => number = Math.random): string[] {
    const shuffled = [...EASY_4_WORDS].sort(() => random() - 0.5);
    return shuffled.slice(0, count);
}
