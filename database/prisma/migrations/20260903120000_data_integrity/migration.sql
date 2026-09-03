-- CreateIndex
CREATE INDEX "Enrollment_course_id_idx" ON "Enrollment"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignment_id_student_id_key" ON "Submission"("assignment_id", "student_id");
