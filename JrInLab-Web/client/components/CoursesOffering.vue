<template>
  <v-row justify="center">
    <v-col
      v-for="(course, index) in courses"
      :key="course.title"
      cols="12"
      lg="4"
      sm="6"
    >
      <v-card>
        <v-list-item :class="course.color" two-line>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ index + 1 }}. {{ course.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="assertion-text">
              {{ course.description.title }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-text class="course-details">
          <strong>Topics: </strong> {{ course.description.topics }} <br /><br />
          <strong>Outcome: </strong> {{ course.description.outcome }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      courses: [
        {
          title: 'Coding Foundations',
          color: 'amber lighten-1',
          description: {
            title: '16 sessions',
            topics:
              'Basics of Scratch, Conditional Statements, Loops & Events, Broadcast to Sync Actions, Variables, Random Numbers, Cloning etc.',
            outcome: '3 animations & a capstone project',
          },
        },
        {
          title: 'Advanced Coding & Game Design',
          color: 'green accent-3',
          description: {
            title: '24 / 32 sessions',
            topics:
              'Advanced Scratch Concepts, Nested Loops, Custom Blocks, Video Sensing, Lists, Logical Operators, String Manipulation, Design Elements etc.',
            outcome: '6 Games & a Capstone Project',
          },
        },
        {
          title: 'Android App Dev',
          color: 'yellow accent-2',
          description: {
            title: '24 sessions (8+ Years)',
            topics:
              'Basics of Blockly, Design Elements (UI/UX), Local & Remote Databases, Phone Sensors, Media Players, Canvas, Lists, App publishing to Play Store etc.',
            outcome: '6 Apps & a Capstone Project',
          },
        },
        {
          title: 'Python Basics',
          color: 'cyan accent-2',
          description: {
            title: '24 sessions (10+ Years)',
            topics:
              'Variables, Basic Data Types, String Manipulation, Math & Logical Operators, Conditional Statements, Lists, Loops, Functions, Basic Modules etc.',
            outcome: '8 Text Games & Graphic Patterns',
          },
        },
        {
          title: 'Python Intermediate',
          color: 'light-blue accent-1',
          description: {
            title: '24 sessions (10+ Years)',
            topics:
              'Data Structures (Tuples, Sets, Dictionaries), 2-D Lists, File I/O operations, In depth Functions, Exception Handling, Simple Classes & Objects etc.',
            outcome: '4 Advanced Projects',
          },
        },
      ],
    }
  },
}
</script>

<style scoped>
.course-details {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.72) !important;
}
</style>
