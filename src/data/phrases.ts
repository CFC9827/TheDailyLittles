/**
 * Curated Phrase Bank for CIPHER
 * 
 * Difficulty is based on:
 * - HARD: Short phrases with high letter diversity (fewer repeats = harder)
 * - MEDIUM: Medium phrases with moderate diversity
 * - EASY: Longer phrases with many repeated letters (more context clues)
 * 
 * All phrases include crossword-style hints.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PhraseData {
    phrase: string;
    hint: string; // Crossword-style clue
}

export const phrases: Record<Difficulty, PhraseData[]> = {
    // EASY: Longer phrases with lots of 2-3 letter words mixed with common bigger words
    easy: [
        { phrase: "I AM SO HAPPY TO BE HERE WITH YOU", hint: "Warm greeting" },
        { phrase: "THE CAT SAT ON THE BIG RED MAT", hint: "Feline resting place" },
        { phrase: "WE CAN GO TO THE PARK AND PLAY", hint: "Outdoor activity" },
        { phrase: "IT IS A NICE DAY TO BE OUTSIDE", hint: "Weather appreciation" },
        { phrase: "SHE HAS A PET DOG AND A CAT TOO", hint: "Multiple pets" },
        { phrase: "HE RAN SO FAR AND DID NOT STOP", hint: "Endurance running" },
        { phrase: "THE SUN IS UP AND THE SKY IS BLUE", hint: "Morning observation" },
        { phrase: "I LIKE TO EAT PIE AND ICE CREAM", hint: "Dessert preference" },
        { phrase: "WE HAD SO MUCH FUN AT THE FAIR", hint: "Event enjoyment" },
        { phrase: "THE BOY AND GIRL WENT TO SCHOOL", hint: "Student transportation" },
        { phrase: "MY MOM AND DAD ARE THE BEST", hint: "Parent appreciation" },
        { phrase: "LET US GO OUT AND SEE THE STARS", hint: "Nighttime activity" },
        { phrase: "THE OLD OWL SAT IN THE BIG TREE", hint: "Bird location" },
        { phrase: "I CAN DO IT IF I TRY MY BEST", hint: "Self motivation" },
        { phrase: "THE FOX RAN BY THE HEN HOUSE", hint: "Farm scene" },
        { phrase: "WE SAW A BIG SHIP ON THE SEA", hint: "Nautical sighting" },
        { phrase: "IT IS NOT TOO HOT OR TOO COLD", hint: "Perfect temperature" },
        { phrase: "THE DOG BIT THE TOY AND RAN OFF", hint: "Pet play" },
        { phrase: "SHE GOT A NEW HAT FOR THE PARTY", hint: "Accessory acquisition" },
        { phrase: "HE IS MY PAL AND WE HAVE FUN", hint: "Friendship description" },
        { phrase: "THE BUS CAME AND WE GOT ON IT", hint: "Public transport" },
        { phrase: "I ATE ALL OF THE CAKE AND PIE", hint: "Dessert consumption" },
        { phrase: "WE MET A NICE MAN AT THE STORE", hint: "Shop encounter" },
        { phrase: "THE SKY WAS SO DARK AND IT RAINED", hint: "Storm description" },
        { phrase: "MY DAD CAN FIX THE CAR FOR US", hint: "Paternal skill" },
        { phrase: "GO TO BED AND GET SOME REST NOW", hint: "Sleep command" },
        { phrase: "THE BAT FLEW UP INTO THE NIGHT", hint: "Nocturnal animal" },
        { phrase: "I AM NOT MAD BUT I AM A BIT SAD", hint: "Mixed emotions" },
        { phrase: "SHE IS SO SHY BUT ALSO VERY KIND", hint: "Personality traits" },
        { phrase: "WE RAN AND RAN UNTIL WE GOT HOME", hint: "Running home" },
        { phrase: "THE OWL CAN FLY HIGH IN THE SKY", hint: "Bird ability" },
        { phrase: "I SEE YOU AND YOU SEE ME TOO", hint: "Mutual observation" },
        { phrase: "HE HAS A NEW TOY CAR TO PLAY WITH", hint: "Gift reception" },
        { phrase: "THE FISH SWAM IN THE BLUE POND", hint: "Aquatic scene" },
        { phrase: "I AM IN MY BED AND I FEEL COZY", hint: "Comfortable state" },
        { phrase: "WE DID IT ALL AND HAD A GREAT TIME", hint: "Full completion" },
        { phrase: "THE RED BUS DROVE DOWN THE ROAD", hint: "Vehicle travel" },
        { phrase: "SHE SET THE BOX ON THE BIG TABLE", hint: "Placement action" },
        { phrase: "LET US EAT AND THEN GO TO SLEEP", hint: "Evening routine" },
        { phrase: "THE MAN AND HIS DOG TOOK A WALK", hint: "Walking together" },
    ],

    // MEDIUM: Balanced phrases (previously Easy) with moderate letter diversity
    medium: [
        { phrase: "THE EARLY BIRD CATCHES THE WORM", hint: "Morning advantage proverb" },
        { phrase: "ACTIONS SPEAK LOUDER THAN WORDS", hint: "Deeds over declarations" },
        { phrase: "ALL GOOD THINGS MUST COME TO AN END", hint: "Nothing lasts forever" },
        { phrase: "EVERY CLOUD HAS A SILVER LINING", hint: "Optimistic outlook on setbacks" },
        { phrase: "A PICTURE IS WORTH A THOUSAND WORDS", hint: "Visual communication power" },
        { phrase: "THERE IS NO PLACE LIKE HOME", hint: "Dorothy's famous line" },
        { phrase: "WHERE THERE IS A WILL THERE IS A WAY", hint: "Determination finds solutions" },
        { phrase: "WHAT GOES AROUND COMES AROUND", hint: "Karma in brief" },
        { phrase: "LAUGHTER IS THE BEST MEDICINE", hint: "Humor heals" },
        { phrase: "THE TRUTH SHALL SET YOU FREE", hint: "Honesty liberates" },
        { phrase: "SLOW AND STEADY WINS THE RACE", hint: "Tortoise's strategy" },
        { phrase: "TOO MANY COOKS SPOIL THE BROTH", hint: "Excess help hinders" },
        { phrase: "PRACTICE MAKES PERFECT", hint: "Repetition breeds mastery" },
        { phrase: "BETTER SAFE THAN SORRY", hint: "Caution prevents regret" },
        { phrase: "BIRDS OF A FEATHER FLOCK TOGETHER", hint: "Similar people associate" },
        { phrase: "THE NIGHT IS ALWAYS DARKEST BEFORE THE DAWN", hint: "Hope follows despair" },
        { phrase: "BE THE CHANGE YOU WISH TO SEE", hint: "Gandhi's call to action" },
        { phrase: "BELIEVE YOU CAN AND YOU ARE HALFWAY THERE", hint: "Roosevelt on confidence" },
        { phrase: "TURN YOUR WOUNDS INTO WISDOM", hint: "Oprah on growth from pain" },
        { phrase: "THE SECRET OF GETTING AHEAD IS GETTING STARTED", hint: "Mark Twain on progress" },
        { phrase: "IMAGINATION IS MORE IMPORTANT THAN KNOWLEDGE", hint: "Einstein on creativity" },
        { phrase: "DO WHAT YOU CAN WITH ALL YOU HAVE", hint: "Roosevelt on resourcefulness" },
        // Additional medium phrases
        { phrase: "A JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP", hint: "Lao Tzu on starting" },
        { phrase: "HAPPINESS IS NOT A DESTINATION IT IS A WAY OF LIFE", hint: "Life philosophy" },
        { phrase: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO", hint: "Jobs on passion" },
        { phrase: "IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY", hint: "Einstein on challenges" },
        { phrase: "LIFE IS WHAT HAPPENS WHEN YOU ARE BUSY MAKING PLANS", hint: "Lennon on spontaneity" },
        { phrase: "NOT ALL WHO WANDER ARE LOST", hint: "Tolkien on exploration" },
        { phrase: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF", hint: "FDR's reassurance" },
        { phrase: "TO BE OR NOT TO BE THAT IS THE QUESTION", hint: "Hamlet's contemplation" },
        { phrase: "IT IS NOT THE YEARS IN YOUR LIFE BUT THE LIFE IN YOUR YEARS", hint: "Lincoln on living fully" },
    ],

    // HARD: Previously Medium phrases with higher diversity
    hard: [
        { phrase: "KNOWLEDGE IS POWER", hint: "Bacon's famous quote" },
        { phrase: "FORTUNE FAVORS THE BOLD", hint: "Latin proverb on courage" },
        { phrase: "TIME HEALS ALL WOUNDS", hint: "Recovery takes patience" },
        { phrase: "HONESTY IS THE BEST POLICY", hint: "Virtue in truthfulness" },
        { phrase: "CURIOSITY KILLED THE CAT", hint: "Warning against nosiness" },
        { phrase: "ABSENCE MAKES THE HEART GROW FONDER", hint: "Distance deepens love" },
        { phrase: "A STITCH IN TIME SAVES NINE", hint: "Early fixes prevent bigger problems" },
        { phrase: "BEAUTY IS IN THE EYE OF THE BEHOLDER", hint: "Subjective aesthetics" },
        { phrase: "ROME WAS NOT BUILT IN A DAY", hint: "Great things take time" },
        { phrase: "TWO HEADS ARE BETTER THAN ONE", hint: "Collaboration benefits" },
        { phrase: "STRIKE WHILE THE IRON IS HOT", hint: "Seize the moment" },
        { phrase: "THE PEN IS MIGHTIER THAN THE SWORD", hint: "Writing over warfare" },
        { phrase: "LOOK BEFORE YOU LEAP", hint: "Think before acting" },
        { phrase: "THE SQUEAKY WHEEL GETS THE GREASE", hint: "Complaints get attention" },
        { phrase: "YOU REAP WHAT YOU SOW", hint: "Consequences follow actions" },
        { phrase: "A FRIEND IN NEED IS A FRIEND INDEED", hint: "True friendship tested by hardship" },
        { phrase: "NECESSITY IS THE MOTHER OF INVENTION", hint: "Need drives creativity" },
        { phrase: "A PENNY SAVED IS A PENNY EARNED", hint: "Franklin on frugality" },
        { phrase: "ALL THAT GLITTERS IS NOT GOLD", hint: "Appearances deceive" },
        { phrase: "GREAT MINDS THINK ALIKE", hint: "Similar conclusions from smart people" },
        { phrase: "TIME AND TIDE WAIT FOR NO MAN", hint: "Unstoppable forces" },
        { phrase: "THE BEST THINGS IN LIFE ARE FREE", hint: "Value beyond money" },
        { phrase: "WHEN IN ROME DO AS THE ROMANS DO", hint: "Adapt to local customs" },
        { phrase: "VARIETY IS THE SPICE OF LIFE", hint: "Diversity enriches existence" },
        { phrase: "BLOOD IS THICKER THAN WATER", hint: "Family bonds strongest" },
        // Additional hard phrases
        { phrase: "CARPE DIEM SEIZE THE DAY", hint: "Latin life philosophy" },
        { phrase: "EVERY DOG HAS ITS DAY", hint: "Everyone gets their turn" },
        { phrase: "EASY COME EASY GO", hint: "Quick gains, quick losses" },
        { phrase: "FIRST IMPRESSIONS LAST", hint: "Initial encounters matter" },
        { phrase: "IF THE SHOE FITS WEAR IT", hint: "Accept fitting criticism" },
        { phrase: "LET BYGONES BE BYGONES", hint: "Forget past wrongs" },
        { phrase: "MIND YOUR OWN BUSINESS", hint: "Stay in your lane" },
        { phrase: "NO PAIN NO GAIN", hint: "Effort brings reward" },
        { phrase: "OUT OF SIGHT OUT OF MIND", hint: "Forgotten when absent" },
        { phrase: "PATIENCE IS A VIRTUE", hint: "Waiting well rewarded" },
        { phrase: "SILENCE IS GOLDEN", hint: "Quiet has value" },
        { phrase: "THE APPLE NEVER FALLS FAR FROM THE TREE", hint: "Kids resemble parents" },
        { phrase: "THE GRASS IS ALWAYS GREENER", hint: "Envying others situations" },
        { phrase: "THINK OUTSIDE THE BOX", hint: "Creative problem solving" },
        { phrase: "WALLS HAVE EARS", hint: "Someone might overhear" },
    ],
};

/**
 * Get all phrases for a difficulty level
 */
export function getPhrases(difficulty: Difficulty): PhraseData[] {
    return phrases[difficulty];
}

/**
 * Get a random phrase for a difficulty level
 */
export function getRandomPhrase(difficulty: Difficulty, seed?: number): PhraseData {
    const phraseList = phrases[difficulty];
    if (seed !== undefined) {
        const index = Math.abs(seed) % phraseList.length;
        return phraseList[index];
    }
    const index = Math.floor(Math.random() * phraseList.length);
    return phraseList[index];
}

/**
 * Get phrase count for a difficulty level
 */
export function getPhraseCount(difficulty: Difficulty): number {
    return phrases[difficulty].length;
}
