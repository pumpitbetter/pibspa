import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultExercises = [
  {
    name: 'Barbell Squat',
    description: 'A compound lower body exercise targeting quads, glutes, and hamstrings',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
    instructions: 'Stand with feet shoulder-width apart, lower into squat position keeping chest up and knees tracking over toes, then drive through heels to return to standing.',
    isDefault: true,
  },
  {
    name: 'Deadlift',
    description: 'A compound exercise working the entire posterior chain',
    category: 'strength',
    muscleGroups: ['hamstrings', 'glutes', 'lower_back', 'traps', 'lats'],
    equipment: 'barbell',
    instructions: 'Stand with feet hip-width apart, bend at hips and knees to grip bar, keep back straight and drive through heels to lift bar.',
    isDefault: true,
  },
  {
    name: 'Bench Press',
    description: 'Upper body compound exercise targeting chest, shoulders, and triceps',
    category: 'strength',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: 'barbell',
    instructions: 'Lie on bench, grip bar with hands slightly wider than shoulder-width, lower bar to chest, then press up.',
    isDefault: true,
  },
  {
    name: 'Pull-ups',
    description: 'Bodyweight exercise targeting back and biceps',
    category: 'strength',
    muscleGroups: ['lats', 'rhomboids', 'biceps', 'core'],
    equipment: 'pull-up bar',
    instructions: 'Hang from bar with overhand grip, pull body up until chin clears bar, lower with control.',
    isDefault: true,
  },
  {
    name: 'Push-ups',
    description: 'Bodyweight exercise for chest, shoulders, and triceps',
    category: 'strength',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    equipment: 'bodyweight',
    instructions: 'Start in plank position, lower body until chest nearly touches ground, push back up.',
    isDefault: true,
  },
  {
    name: 'Running',
    description: 'Cardiovascular exercise for endurance and conditioning',
    category: 'cardio',
    muscleGroups: ['legs', 'cardiovascular'],
    equipment: 'none',
    instructions: 'Maintain steady pace, focus on breathing and form.',
    isDefault: true,
  },
  {
    name: 'Plank',
    description: 'Core strengthening exercise',
    category: 'strength',
    muscleGroups: ['core', 'shoulders'],
    equipment: 'bodyweight',
    instructions: 'Hold straight body position supported on forearms and toes, engage core.',
    isDefault: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create default exercises
  for (const exercise of defaultExercises) {
    // Check if exercise already exists
    const existingExercise = await prisma.exercise.findFirst({
      where: { 
        name: exercise.name,
        isDefault: true
      }
    });
    
    if (!existingExercise) {
      await prisma.exercise.create({
        data: exercise,
      });
      console.log(`✅ Created exercise: ${exercise.name}`);
    } else {
      console.log(`⏭️  Exercise already exists: ${exercise.name}`);
    }
  }
  
  console.log('✅ Database seeded successfully!');
  console.log(`📊 Processed ${defaultExercises.length} default exercises`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });