// Generate leaderboard data with diverse names including Yoruba names
const names = [
  // Yoruba names
  'Adewale Johnson', 'Funmilayo Okonkwo', 'Babatunde Adeola', 'Folake Adebayo',
  'Oluwaseun Williams', 'Ayodeji Okafor', 'Chioma Adeleke', 'Oluwatobi Adeyemi',
  'Temitope Okoro', 'Abidemi Hassan', 'Olufemi Bello', 'Morenike Ojo',
  'Kehinde Peters', 'Taiwo Martinez', 'Bolaji Dada', 'Yetunde Akinola',
  'Segun Thompson', 'Adenike Brown', 'Kolawole Davis', 'Omolara Wilson',
  'Damilola Garcia', 'Titilayo Moore', 'Ifeoluwa Taylor', 'Olumide Anderson',
  'Bukola Jackson', 'Modupe Thomas', 'Abiodun White', 'Omotola Harris',
  'Chukwudi Martin', 'Ngozi Lee', 'Chiamaka Walker', 'Adaeze Hall',
  
  // International names
  'Sarah Williams', 'Alex Johnson', 'Michael Chen', 'Emma Davis',
  'David Brown', 'Lisa Anderson', 'James Wilson', 'Maria Garcia',
  'Robert Martinez', 'Jennifer Lopez', 'William Rodriguez', 'Linda Hernandez',
  'Richard Moore', 'Patricia Taylor', 'Thomas Anderson', 'Elizabeth Thomas',
  'Christopher Lee', 'Margaret White', 'Daniel Harris', 'Jessica Clark',
  'Matthew Lewis', 'Ashley Robinson', 'Andrew Walker', 'Amanda Young',
  'Joshua King', 'Melissa Wright', 'Kevin Scott', 'Stephanie Green',
  'Brian Adams', 'Nicole Baker', 'George Nelson', 'Rebecca Carter',
  'Edward Mitchell', 'Laura Perez', 'Jason Roberts', 'Kimberly Turner',
  'Ryan Phillips', 'Michelle Campbell', 'Jacob Parker', 'Emily Evans',
  'Nicholas Edwards', 'Angela Collins', 'Tyler Stewart', 'Hannah Morris',
  'Aaron Rogers', 'Samantha Reed', 'Jonathan Cook', 'Rachel Morgan',
  'Brandon Bell', 'Lauren Murphy', 'Samuel Bailey', 'Victoria Rivera',
  'Nathan Cooper', 'Megan Richardson', 'Benjamin Cox', 'Katherine Howard',
  'Alexander Ward', 'Brittany Torres', 'Christian Peterson', 'Diana Gray',
  'Dylan Ramirez', 'Alexis James', 'Austin Watson', 'Sophia Brooks',
  'Jose Kelly', 'Grace Sanders', 'Noah Price', 'Olivia Bennett',
  'Lucas Wood', 'Isabella Barnes', 'Mason Ross', 'Ava Henderson',
  'Ethan Coleman', 'Mia Jenkins', 'Logan Perry', 'Charlotte Powell',
  'Caleb Long', 'Abigail Patterson', 'Owen Hughes', 'Harper Flores',
  'Carter Washington', 'Evelyn Butler', 'Jayden Simmons', 'Ella Foster',
];

export const generateLeaderboardData = (
  userName: string,
  userAvatar: string,
  totalEntries: number = 100,
  isWeekly: boolean = false
) => {
  const leaderboard = [];
  
  // Add current user at #1
  leaderboard.push({
    rank: 1,
    name: userName,
    points: isWeekly ? 450 : 1850,
    streak: Math.floor(Math.random() * 20) + 5,
    avatar: userAvatar,
    change: Math.floor(Math.random() * 5) - 2,
    isCurrentUser: true,
  });

  // Generate remaining entries
  let basePoints = isWeekly ? 440 : 1800;
  
  for (let i = 2; i <= totalEntries; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const pointsDecrement = isWeekly ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 50) + 20;
    basePoints -= pointsDecrement;
    
    leaderboard.push({
      rank: i,
      name: randomName,
      points: Math.max(basePoints, 10), // Ensure points don't go below 10
      streak: Math.floor(Math.random() * 30) + 1,
      avatar: '',
      change: Math.floor(Math.random() * 7) - 3, // Change between -3 and +3
    });
  }

  return leaderboard;
};
