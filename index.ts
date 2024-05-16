#! /usr/bin/env node

import boxen from 'boxen';
import inquirer from 'inquirer';
import chalk from 'chalk';

interface Course {
  id:number;
  name: string;
  fee: number;
}

interface Student {
  id: string;
  name: string;
  courses: Course[];
  balance: number;
}

class StudentManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];

  constructor() {

    this.courses = [
      {id:1,name: 'Typescript', fee: 5000 },
      {id:2,name: 'Javascript', fee: 4000 },
      {id:3,name: 'Artificial Intelligence', fee: 3000 },
      {id:4,name: 'Software Development', fee: 1000 },
      {id:5,name: 'Internet of Things', fee: 250}
    ];
  }
  getStudents(): Student[] {
    return this.students;
  }

  getCourses(): Course[] {
    return this.courses;
  }
  
  private generateStudentId(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
  
  addStudent(name: string): void {
    const id = this.generateStudentId();
    const student: Student = {
      id,
      name,
      courses: [],
      balance: 0
    };
    this.students.push(student);
    console.log(`\nName:${name}\nID: ${id}`);
  }

enrollStudent(studentId: string, courseId: number): void {
  const student = this.students.find(s => s.id === studentId);
  const course = this.courses.find(c => c.id === courseId);
  if (student && course) {
    student.courses.push(course);
    student.balance += course.fee;
    console.log(`\nStudent: ${student.name} \nCourse: ${course.name}`);
  } else {
    console.log('Student or course not found.');
  }
}
  
removeStudent(studentId: string): void{
  const student = this.students.find(s => s.id === studentId);
  if (student) {
    this.students = this.students.filter(s => s.id !== studentId);
    console.log(`\nStudent: ${student.name} \n Courses: ${student.courses}`);
    console.log(`\n Student Removed Succesfully`)
  } else {
    console.log('Student not found.');
  }
}
  
payTution(studentId: string, amount: number): void {
  const student = this.students.find(s => s.id === studentId);
  if (student) {
    if (amount <= student.balance) {
      student.balance -= amount;
      console.log(`\nStudent: ${studentId}\nAmount Paid: ${amount}\nRemaining Balance: ${student.balance}`);
    } else {
      console.log('Thank you, all due payment is Cleared.');
    }
  } else {
    console.log('Student not found.');
  }
}

viewBalance(studentId: string): void {
  console.log("Searching for student with ID:", studentId);
  const student = this.students.find(s => s.id === studentId);
  if (student) {
    console.log(`\nStudent: ${studentId}\nRemaining balance:${student.balance}`);
  } else {
    console.log('Student not found.');
  }
}

showStatus(studentId: string): void {
  console.log("Searching for student with ID:", studentId);
  const student = this.students.find(s => s.id === studentId);
  if (student) {
    console.log(`\nStudent ID: ${student.id}`);
    console.log(`Name: ${student.name}`);
    student.courses.forEach(course => {
      console.log(`Courses Enrolled: ${course.name}`);
      console.log(`Balance: Rs.${student.balance}`);
    });
  } else {
    console.log('Student not found.');
  }
}

generateIdCard(studentId: string): void{
  console.log("Searching for student with ID:", studentId);
  const student = this.students.find(s => s.id === studentId);
  if (student) {
    console.log(chalk.green(`\n    Student ID Card`))
   
}else{
    console.log('Student not found.');
}

}}

const sms = new StudentManagementSystem();

function addStudent() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter student name:',
      validate: function(input) {
          //check if the input contains only alphabetical characters
        if (/^[A-Za-z]+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only alphabetical characters, press delete to exit and re-enter student name.';
        }
      }
    }
  ]).then(answers => {
    sms.addStudent(answers.name);
    mainMenu();
  });
}

function enrollStudent() {
  const students = sms.getStudents();
  const courses = sms.getCourses();
  if (students.length === 0 || courses.length === 0) {
    console.log('No students or courses found.');
    mainMenu();
    return;
  } 

  inquirer.prompt([
    {
      type: 'list',
      name: 'studentId',
      message: 'Select student:',
      choices: students.map(student => ({ name: student.name, value: student.id }))
    },
    {
      type: 'list',
      name: 'courseId',
      message: 'Select course:',
      choices: courses.map(course => ({ name: course.name, value: course.id }))
    },
  ]).then(answers => {
    sms.enrollStudent(answers.studentId, answers.courseId);
    mainMenu();
  });
}

function payTuition(): void {
  inquirer.prompt([
    {
      type: 'input',
      name: 'studentId',
      message: 'Enter student ID:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the student ID.';
        }
      }
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Enter amount to pay:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the amount.';
        }
      }
    }
  ]).then(answers => {
    // Logging to see if the answers are captured correctly
    //console.log("Answers:", answers);
    const students = sms.getStudents();
    //console.log("Students:", students); // Logging students to see if they're fetched correctly
    const student = students.find(student => student.id === answers.studentId);
    //console.log("Found Student:", student); // Logging the found student
    if (student) {
      sms.payTution(answers.studentId, parseFloat(answers.amount));
    } else {
      console.log('Student not found.');
    }
    mainMenu();
  });
}

function removeStu(){
  inquirer.prompt({
    name:"id",
    type:'input',
    message:'Enter the student id to be removed',
  }).then(ans =>{
    sms.removeStudent(ans.id);
    mainMenu();
  })
  
}

function viewBalance() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'studentId',
      message: 'Enter student ID:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the amount.';
        }
      }
    }
  ]).then(answers => {
    //console.log("Entered Student ID:", answers.studentId); // Logging the entered student ID
    const students = sms.getStudents();
    //console.log("Students:", students); // Logging students to see if they're fetched correctly
    const student = students.find(student => student.id === answers.studentId);
    //console.log("Found Student:", student); // Logging the found student
    if (student) {
      sms.viewBalance(answers.studentId);
    } else {
      console.log('Student not found.');
    }
    mainMenu();
  });
}

function showStatus() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'studentId',
      message: 'Enter student ID:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the amount.';
        }
      }
    }
  ]).then(answers => {
    //console.log("Entered Student ID:", answers.studentId); // Logging the entered student ID
    const students = sms.getStudents();
    //console.log("Students:", students); // Logging students to see if they're fetched correctly
    const student = students.find(student => student.id === answers.studentId);
    //console.log("Found Student:", student); // Logging the found student
    if (student) {
      sms.showStatus(answers.studentId);
    } else {
      console.log('Student not found.');
    }
    mainMenu();
  });
}
function generateIdCard(){
    inquirer.prompt([
        {
          type: 'input',
          name: 'studentId',
          message: 'Enter student ID:',
          validate: function(input) {
            // Check if the input contains only numerical digits
            if (/^\d+$/.test(input)) {
              return true;
            } else {
              return 'Please enter only numerical digits for the amount.';
            }
          }
        }
      ]).then(answers => {
        const students = sms.getStudents();
        //console.log("Students:", students); // Logging students to see if they're fetched correctly
        const student = students.find(student => student.id === answers.studentId);
        //console.log("Found Student:", student); // Logging the found student
        if (student) {
          
            //  Function to generate the ID card with logo
function generateIDCardWithLogo() {
    // Example logo (replace this with your own ASCII art or text representation)


    const card = `
${chalk.bold('Name:')} ${student?.name}             
${chalk.bold('ID:')} ${student?.id}      
${chalk.bold('Courses:')} ${student?.courses[0]}     
${chalk.bold('Role:')} Student 
    `


    // P   
    
    const options:any = {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue',
        backgroundColor: '#f0f0f0'
    };

    return boxen(card, options);
}
let c = generateIDCardWithLogo()
console.log(c)

        } else {
          console.log('Student not found.');
        }
        mainMenu();
      });
}
console.log(chalk.italic.underline.magenta("\n Welcome to Student Management System \n"));

function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: (chalk.green('Select an Operations')),
      choices: [
        'Add Student',
        'Enroll Student',
        'Pay Tuition',
        'Remove Student',
        'View Balance',
        'Show Status',
        'Generate ID Card',
        'Exit'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'Add Student':
        addStudent();
        break;
        case 'Remove Student':
        removeStu();
        break;
      case 'Enroll Student':
        enrollStudent();
        break;
        case 'View Balance':
        viewBalance();
        break;
        case 'Pay Tuition':
        payTuition();
        break;
        case 'Show Status':
        showStatus();
        break;
        case 'Generate ID Card':
        generateIdCard();
        break;

      // Add cases for other actions
      case 'Exit':
        console.log(chalk.bold.italic.underline.yellow('\n\t ````````````````````````````Thank You ``````````````````````````'));
        break;
      default:
        console.log('Invalid choice.');
        mainMenu();
    }
  });
}

mainMenu();
