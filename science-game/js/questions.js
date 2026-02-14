/**
 * Science Game - Grade 3 Question Bank
 * 6 Topics x 10 Questions each = 60 total questions
 * Each question has: text, options (4), correct index, explanation, optional visual hint
 */
var ScienceQuestions = {

  // =========================================================
  // TOPIC 1: States of Matter
  // =========================================================
  matter: {
    title: 'States of Matter',
    color: '#4FC3F7',
    icon: 'matter',
    questions: [
      {
        text: 'What are the three main states of matter?',
        options: ['Solid, Liquid, Gas', 'Hot, Cold, Warm', 'Big, Medium, Small', 'Hard, Soft, Smooth'],
        correct: 0,
        explanation: 'Matter exists in three main states: solid, liquid, and gas!'
      },
      {
        text: 'What happens to ice when it melts?',
        options: ['It becomes a gas', 'It becomes a liquid', 'It stays the same', 'It disappears'],
        correct: 1,
        explanation: 'When ice melts, it changes from a solid to a liquid (water).'
      },
      {
        text: 'Which of these is a GAS?',
        options: ['A rock', 'Milk', 'Air', 'Sand'],
        correct: 2,
        explanation: 'Air is a gas! You can\'t see it, but it\'s all around us.'
      },
      {
        text: 'What is the process called when water turns into steam?',
        options: ['Freezing', 'Melting', 'Evaporation', 'Condensation'],
        correct: 2,
        explanation: 'Evaporation is when liquid water heats up and turns into water vapor (gas).'
      },
      {
        text: 'Which state of matter has a fixed shape?',
        options: ['Liquid', 'Gas', 'Solid', 'All of them'],
        correct: 2,
        explanation: 'Solids have a fixed shape. Liquids and gases take the shape of their container.'
      },
      {
        text: 'What happens when you put water in the freezer?',
        options: ['It evaporates', 'It turns into ice', 'It stays the same', 'It turns into gas'],
        correct: 1,
        explanation: 'When water gets very cold, it freezes and becomes ice (a solid)!'
      },
      {
        text: 'Which one is a LIQUID?',
        options: ['A book', 'Oxygen', 'Orange juice', 'A pencil'],
        correct: 2,
        explanation: 'Orange juice is a liquid! It flows and takes the shape of its container.'
      },
      {
        text: 'Can you pour a solid into a glass?',
        options: ['Yes, always', 'No, solids have their own shape', 'Only if it\'s hot', 'Only if it\'s small'],
        correct: 1,
        explanation: 'Solids have their own fixed shape and cannot be poured like liquids.'
      },
      {
        text: 'Steam coming from a hot pot is an example of which state?',
        options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
        correct: 2,
        explanation: 'Steam is water in its gas form. Heat turns liquid water into gas!'
      },
      {
        text: 'What do we call it when gas turns back into liquid?',
        options: ['Evaporation', 'Freezing', 'Condensation', 'Melting'],
        correct: 2,
        explanation: 'Condensation is when gas cools down and becomes liquid, like water drops on a cold glass!'
      }
    ]
  },

  // =========================================================
  // TOPIC 2: Solar System
  // =========================================================
  solar: {
    title: 'Solar System',
    color: '#FFD93D',
    icon: 'solar',
    questions: [
      {
        text: 'What is at the center of our solar system?',
        options: ['The Moon', 'Earth', 'The Sun', 'Mars'],
        correct: 2,
        explanation: 'The Sun is the star at the center of our solar system!'
      },
      {
        text: 'How many planets are in our solar system?',
        options: ['6', '7', '8', '9'],
        correct: 2,
        explanation: 'There are 8 planets in our solar system!'
      },
      {
        text: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1,
        explanation: 'Mars is called the Red Planet because of its reddish appearance!'
      },
      {
        text: 'Which is the BIGGEST planet in our solar system?',
        options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
        correct: 2,
        explanation: 'Jupiter is the largest planet - over 1,000 Earths could fit inside it!'
      },
      {
        text: 'What does the Earth orbit around?',
        options: ['The Moon', 'Mars', 'The Sun', 'Jupiter'],
        correct: 2,
        explanation: 'Earth orbits (goes around) the Sun. It takes about 365 days!'
      },
      {
        text: 'Which planet has beautiful rings around it?',
        options: ['Mercury', 'Venus', 'Earth', 'Saturn'],
        correct: 3,
        explanation: 'Saturn is famous for its beautiful rings made of ice and rock!'
      },
      {
        text: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Mercury', 'Earth', 'Mars'],
        correct: 1,
        explanation: 'Mercury is the closest planet to the Sun and also the smallest!'
      },
      {
        text: 'What is the Moon?',
        options: ['A star', 'A planet', 'Earth\'s natural satellite', 'A comet'],
        correct: 2,
        explanation: 'The Moon is Earth\'s natural satellite that orbits around us!'
      },
      {
        text: 'Why do we have day and night?',
        options: ['The Sun moves', 'Earth rotates on its axis', 'The Moon blocks the Sun', 'Stars turn off'],
        correct: 1,
        explanation: 'Earth spins (rotates) on its axis. The side facing the Sun has day!'
      },
      {
        text: 'What is a star made of?',
        options: ['Rock and dirt', 'Hot glowing gas', 'Ice and water', 'Metal and glass'],
        correct: 1,
        explanation: 'Stars are made of very hot glowing gases, mainly hydrogen and helium!'
      }
    ]
  },

  // =========================================================
  // TOPIC 3: Plant Life
  // =========================================================
  plants: {
    title: 'Plant Life',
    color: '#66BB6A',
    icon: 'plants',
    questions: [
      {
        text: 'What do plants need to grow?',
        options: ['Only water', 'Water, sunlight, and soil', 'Only sunlight', 'Only soil'],
        correct: 1,
        explanation: 'Plants need water, sunlight, and nutrients from soil to grow!'
      },
      {
        text: 'What is the process called when plants make their own food?',
        options: ['Cooking', 'Photosynthesis', 'Digestion', 'Breathing'],
        correct: 1,
        explanation: 'Photosynthesis is how plants use sunlight to make food from water and air!'
      },
      {
        text: 'Which part of the plant takes in water from the soil?',
        options: ['Leaves', 'Flowers', 'Roots', 'Stem'],
        correct: 2,
        explanation: 'Roots grow underground and absorb water and nutrients from the soil.'
      },
      {
        text: 'What gas do plants release that we breathe?',
        options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Helium'],
        correct: 2,
        explanation: 'Plants release oxygen during photosynthesis - the gas we need to breathe!'
      },
      {
        text: 'What grows from a seed first?',
        options: ['Flowers', 'Fruits', 'A tiny root', 'Leaves'],
        correct: 2,
        explanation: 'When a seed starts growing, a tiny root comes out first to anchor it.'
      },
      {
        text: 'What is the job of a flower on a plant?',
        options: ['To look pretty', 'To make seeds', 'To absorb water', 'To make oxygen'],
        correct: 1,
        explanation: 'Flowers help plants make seeds so new plants can grow!'
      },
      {
        text: 'What carries water from the roots to the leaves?',
        options: ['The flower', 'The soil', 'The stem', 'The seeds'],
        correct: 2,
        explanation: 'The stem works like a straw, carrying water up from the roots to the leaves!'
      },
      {
        text: 'Where does photosynthesis mostly happen?',
        options: ['In the roots', 'In the stem', 'In the leaves', 'In the flowers'],
        correct: 2,
        explanation: 'Leaves are where most photosynthesis happens because they catch sunlight!'
      },
      {
        text: 'What do plants take in from the air?',
        options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Water vapor'],
        correct: 1,
        explanation: 'Plants absorb carbon dioxide from the air and use it to make food!'
      },
      {
        text: 'In what season do many trees lose their leaves?',
        options: ['Spring', 'Summer', 'Autumn (Fall)', 'Winter'],
        correct: 2,
        explanation: 'In autumn, many trees lose their leaves to save energy for winter!'
      }
    ]
  },

  // =========================================================
  // TOPIC 4: Animals
  // =========================================================
  animals: {
    title: 'Animals',
    color: '#FF8A65',
    icon: 'animals',
    questions: [
      {
        text: 'What do we call animals that eat only plants?',
        options: ['Carnivores', 'Herbivores', 'Omnivores', 'Insectivores'],
        correct: 1,
        explanation: 'Herbivores are animals that eat only plants, like cows and rabbits!'
      },
      {
        text: 'What do we call animals that eat only meat?',
        options: ['Herbivores', 'Omnivores', 'Carnivores', 'Vegetarians'],
        correct: 2,
        explanation: 'Carnivores eat only meat - lions and eagles are carnivores!'
      },
      {
        text: 'Which group of animals has feathers?',
        options: ['Mammals', 'Reptiles', 'Birds', 'Fish'],
        correct: 2,
        explanation: 'Birds are the only animals that have feathers!'
      },
      {
        text: 'What do fish use to breathe underwater?',
        options: ['Lungs', 'Nose', 'Gills', 'Skin'],
        correct: 2,
        explanation: 'Fish have gills that take oxygen from the water so they can breathe!'
      },
      {
        text: 'Which animal is a mammal?',
        options: ['Snake', 'Frog', 'Dog', 'Goldfish'],
        correct: 2,
        explanation: 'Dogs are mammals! Mammals have fur, are warm-blooded, and feed babies milk.'
      },
      {
        text: 'What is a habitat?',
        options: ['An animal\'s food', 'An animal\'s natural home', 'An animal\'s baby', 'An animal\'s color'],
        correct: 1,
        explanation: 'A habitat is the natural environment where an animal lives and finds food.'
      },
      {
        text: 'Which animal goes through metamorphosis?',
        options: ['Dog', 'Cat', 'Butterfly', 'Elephant'],
        correct: 2,
        explanation: 'Butterflies go through metamorphosis: egg, caterpillar, chrysalis, butterfly!'
      },
      {
        text: 'What do reptiles have on their skin?',
        options: ['Fur', 'Feathers', 'Scales', 'Slime'],
        correct: 2,
        explanation: 'Reptiles like snakes and lizards have dry, scaly skin!'
      },
      {
        text: 'What do we call animals that are awake at night?',
        options: ['Diurnal', 'Nocturnal', 'Hibernating', 'Migrating'],
        correct: 1,
        explanation: 'Nocturnal animals are active at night - like owls and bats!'
      },
      {
        text: 'Why do some birds fly south in winter?',
        options: ['To find warmth and food', 'To visit friends', 'Because they are lost', 'For fun'],
        correct: 0,
        explanation: 'Birds migrate south to find warmer weather and more food in winter!'
      }
    ]
  },

  // =========================================================
  // TOPIC 5: Human Body
  // =========================================================
  body: {
    title: 'Human Body',
    color: '#EF9A9A',
    icon: 'body',
    questions: [
      {
        text: 'How many bones does an adult human body have?',
        options: ['106', '206', '306', '406'],
        correct: 1,
        explanation: 'An adult human has 206 bones! Babies are born with about 270.'
      },
      {
        text: 'What organ pumps blood through your body?',
        options: ['Brain', 'Lungs', 'Heart', 'Stomach'],
        correct: 2,
        explanation: 'Your heart is a muscle that pumps blood all through your body!'
      },
      {
        text: 'What do we use our lungs for?',
        options: ['Thinking', 'Breathing', 'Digesting food', 'Moving'],
        correct: 1,
        explanation: 'We use our lungs to breathe in oxygen and breathe out carbon dioxide!'
      },
      {
        text: 'What is the biggest organ in the human body?',
        options: ['Heart', 'Brain', 'Liver', 'Skin'],
        correct: 3,
        explanation: 'Skin is the largest organ! It covers and protects your entire body.'
      },
      {
        text: 'What part of the body controls everything you do?',
        options: ['Heart', 'Brain', 'Stomach', 'Bones'],
        correct: 1,
        explanation: 'The brain controls everything - thinking, moving, breathing, and feeling!'
      },
      {
        text: 'What type of food helps build strong bones?',
        options: ['Candy', 'Chips', 'Milk and cheese (calcium)', 'Soda'],
        correct: 2,
        explanation: 'Foods with calcium, like milk and cheese, help build strong bones!'
      },
      {
        text: 'How many senses do humans have?',
        options: ['3', '4', '5', '6'],
        correct: 2,
        explanation: 'We have 5 senses: sight, hearing, taste, smell, and touch!'
      },
      {
        text: 'What carries blood away from the heart?',
        options: ['Veins', 'Arteries', 'Nerves', 'Muscles'],
        correct: 1,
        explanation: 'Arteries carry blood away from the heart to the rest of your body!'
      },
      {
        text: 'What helps you move your body?',
        options: ['Skin', 'Hair', 'Muscles', 'Nails'],
        correct: 2,
        explanation: 'Muscles pull on your bones to help you move, run, and jump!'
      },
      {
        text: 'Where does food go after you swallow it?',
        options: ['Lungs', 'Heart', 'Brain', 'Stomach'],
        correct: 3,
        explanation: 'After swallowing, food travels down to your stomach to be digested!'
      }
    ]
  },

  // =========================================================
  // TOPIC 6: Weather
  // =========================================================
  weather: {
    title: 'Weather',
    color: '#B0BEC5',
    icon: 'weather',
    questions: [
      {
        text: 'What causes rain?',
        options: ['Wind blowing', 'Clouds releasing water droplets', 'The Sun crying', 'Mountains leaking'],
        correct: 1,
        explanation: 'Rain happens when water droplets in clouds get heavy and fall down!'
      },
      {
        text: 'What is the Sun?',
        options: ['A planet', 'A moon', 'A star', 'A cloud'],
        correct: 2,
        explanation: 'The Sun is a star! It gives us heat and light.'
      },
      {
        text: 'What instrument measures temperature?',
        options: ['Ruler', 'Thermometer', 'Clock', 'Scale'],
        correct: 1,
        explanation: 'A thermometer measures how hot or cold something is (temperature)!'
      },
      {
        text: 'What type of cloud is big, fluffy, and white?',
        options: ['Stratus', 'Cumulus', 'Cirrus', 'Nimbus'],
        correct: 1,
        explanation: 'Cumulus clouds are the big, fluffy, cotton-like clouds we often see!'
      },
      {
        text: 'What comes after lightning?',
        options: ['Rain', 'Wind', 'Thunder', 'Snow'],
        correct: 2,
        explanation: 'Thunder is the sound made by lightning! Light travels faster than sound.'
      },
      {
        text: 'What is snow made of?',
        options: ['Frozen rain', 'Ice crystals', 'White dust', 'Cloud pieces'],
        correct: 1,
        explanation: 'Snow is made of tiny ice crystals that form in very cold clouds!'
      },
      {
        text: 'What causes wind?',
        options: ['Trees moving', 'Moving air', 'The Moon pulling', 'Clouds pushing'],
        correct: 1,
        explanation: 'Wind is moving air! It happens when warm air rises and cool air rushes in.'
      },
      {
        text: 'What makes a rainbow appear?',
        options: ['Magic', 'Sunlight shining through rain', 'Colorful clouds', 'The Moon'],
        correct: 1,
        explanation: 'Rainbows form when sunlight passes through raindrops and splits into colors!'
      },
      {
        text: 'In which season is it usually hottest?',
        options: ['Spring', 'Summer', 'Autumn', 'Winter'],
        correct: 1,
        explanation: 'Summer is the hottest season because Earth is tilted toward the Sun!'
      },
      {
        text: 'What is fog?',
        options: ['Smoke from fires', 'A cloud near the ground', 'Dust in the air', 'Steam from the ocean'],
        correct: 1,
        explanation: 'Fog is a cloud that forms at ground level, making it hard to see!'
      }
    ]
  }
};
