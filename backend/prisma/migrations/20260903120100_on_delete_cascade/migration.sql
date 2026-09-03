-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_teacher_id_fkey";
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_student_id_fkey";
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_course_id_fkey";
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_course_id_fkey";
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assignment_id_fkey";
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_student_id_fkey";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
