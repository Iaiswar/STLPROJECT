import re
import pandas as pd
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework_simplejwt.tokens import RefreshToken

# ==========================
# Device Management Modelss
# ==========================

class Device(models.Model):
    base_id = models.IntegerField(unique=True)
    mode = models.CharField(max_length=50)
    info = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='connected')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Device {self.base_id} - {self.status}"

    class Meta:
        ordering = ['-created_at']


class KeypadEvent(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='events')
    key_id = models.IntegerField()
    key_sn = models.CharField(max_length=100)
    mode = models.CharField(max_length=50)
    timestamp = models.BigIntegerField()
    info = models.TextField(blank=True, null=True)
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Key {self.key_id} - SN: {self.key_sn} - Device: {self.device.base_id}"

    class Meta:
        ordering = ['-created_at']


class VoteSession(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='vote_sessions')
    session_id = models.IntegerField()
    duration = models.IntegerField()  # in seconds
    config = models.CharField(max_length=200)  # e.g., "1,1,0,0,4,1"
    status = models.CharField(max_length=20, default='active')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Vote Session {self.session_id} - Device: {self.device.base_id}"

    class Meta:
        ordering = ['-started_at']


# ==========================
# User Management Models
# ==========================

# Role Choices
ROLE_CHOICES = [
    ('developer', 'Developer'),
    ('management', 'Management'),
    ('admin', 'Admin'),
    ('instructor', 'Instructor'),
    ('operator', 'Operator')
]

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, employeeid, first_name, last_name, role, hq, factory, department, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            employeeid=employeeid,
            first_name=first_name,
            last_name=last_name,
            role=role,
            hq=hq,
            factory=factory,
            department=department,
            is_active=True  
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, employeeid, first_name, last_name, role, hq, factory, department, password=None):
        user = self.create_user(
            email=email,
            employeeid=employeeid,
            first_name=first_name,
            last_name=last_name,
            role=role,
            hq=hq,
            factory=factory,
            department=department,
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True  
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    employeeid = models.CharField(max_length=10, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='') 

    hq = models.CharField(max_length=50, blank=True, null=True)
    factory = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=50, blank=True, null=True)

    status = models.BooleanField(default=True)  

    # Required Django Fields
    is_active = models.BooleanField(default=True)  
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['employeeid', 'first_name', 'last_name', 'role', 'hq', 'factory', 'department']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }


# ==========================
# Organizational Structure Models
# ==========================

# Level Choices
LEVEL_CHOICES = [
    ('level_1', 'Level 1'),
    ('level_2', 'Level 2'),
    ('level_3', 'Level 3'),
    ('level_4', 'Level 4'),
]


class HQ(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Factory(models.Model):
    hq = models.ForeignKey(HQ, on_delete=models.CASCADE, related_name='factories')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.hq.name})"


class Department(models.Model):
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.factory.name})"


class Line(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='lines')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.department.name})"


class Level(models.Model):
    line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name='levels')
    name = models.CharField(max_length=20, choices=LEVEL_CHOICES)

    def __str__(self):
        return f"{self.get_name_display()} ({self.line.name})"






class Days(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='days')
    day = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.day} - {self.level.get_name_display()}"
    




# ==========================
# Level 1
# ==========================

class SkillTraining(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='skill_trainings')
    title = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.title} - {self.level.get_name_display()}"


class SubTopic(models.Model):
    skill_training = models.ForeignKey(SkillTraining, on_delete=models.CASCADE, related_name='subtopics')
    day = models.ForeignKey(Days, on_delete=models.CASCADE, related_name='subtopics')
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title


class SubTopicContent(models.Model):
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, related_name='subtopiccontents')
    title = models.CharField(max_length=100,default='')


class TrainingContent(models.Model):
    subtopic_content = models.ForeignKey(SubTopicContent, on_delete=models.CASCADE, related_name='contents',default='')
    description = models.TextField()
    training_file = models.FileField(upload_to='training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Content for {self.subtopic_content.title}"




from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver



class OperatorMaster(models.Model):
    sr_no = models.IntegerField(default=0)  # give IntegerField a default of 0
    employee_code = models.CharField(max_length=20, unique=True, default='')  
    full_name = models.CharField(max_length=100, default='')  
    date_of_join = models.DateField(null=True, blank=True)  # already nullable
    employee_pattern_category = models.CharField(max_length=100, default='')
    designation = models.CharField(max_length=100, default='')
    department = models.CharField(max_length=50, null=True, blank=True, default='')
    department_code = models.CharField(max_length=20, null=True, blank=True, default='')
    
    def __str__(self):
        return f"{self.employee_code} - {self.full_name}"






class Test(models.Model):
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, related_name="tests")
    test_name = models.CharField(max_length=255)
    questions_file = models.FileField(upload_to='test_questions/', blank=True, null=True)
    operators = models.ManyToManyField(OperatorMaster, related_name='tests', blank=True)

    def __str__(self):
        return self.test_name

    def import_questions(self):
        if not self.questions_file:
            return

        file_path = self.questions_file.path
        try:
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith('.xlsx'):
                df = pd.read_excel(file_path)
            else:
                print("Unsupported file format")
                return

            required_columns = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
            if not all(col in df.columns for col in required_columns):
                print("Invalid file format: Missing columns")
                return

            for _, row in df.iterrows():
                Question.objects.create(
                    test=self,
                    question=row['question'],
                    option_a=row['option_a'],
                    option_b=row['option_b'],
                    option_c=row['option_c'],
                    option_d=row['option_d'],
                    correct_answer=row['correct_answer']
                )
            print("Questions imported successfully")
        except Exception as e:
            print(f"Error processing file: {e}")


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    question = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question


class OperatorTestAssignment(models.Model):
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    assigned_on = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('operator', 'test')

    def __str__(self):
        return f"{self.operator} assigned to {self.test}"


class OperatorRemoteAssignment(models.Model):
    operator = models.ForeignKey('OperatorTestAssignment', on_delete=models.CASCADE)
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    key_id = models.IntegerField()
    assigned_on = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('operator', 'device', 'key_id')

    def __str__(self):
        return f"{self.operator} assigned Key {self.key_id} from Device {self.device.base_id}"


# Signal handler
@receiver(post_save, sender=Test)
def handle_uploaded_file(sender, instance, created, **kwargs):
    if created and instance.questions_file:
        instance.import_questions()









class OperatorSkillLevel(models.Model):
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE, related_name="skill_levels")
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    trainings = models.ManyToManyField(SkillTraining, blank=True)

    written_test_date = models.DateField(null=True, blank=True)
    written_test_score = models.FloatField(null=True, blank=True)
    practical_test_date = models.DateField(null=True, blank=True)
    practical_test_score = models.FloatField(null=True, blank=True)
    observation_start_date = models.DateField(null=True, blank=True)
    observation_end_date = models.DateField(null=True, blank=True)
    observation_score = models.FloatField(null=True, blank=True)

    status = models.CharField(max_length=50, choices=[('Pass', 'Pass'), ('Fail', 'Fail'), ('Pending', 'Pending')])






from django.db import models

class TrainingReport(models.Model):
    month = models.DateField()  # e.g., 2024-01-01 for January 2024
    new_operators_joined = models.PositiveIntegerField(default=0)
    new_operators_trained = models.PositiveIntegerField(default=0)
    total_trainings_planned = models.PositiveIntegerField(default=0)
    total_trainings_actual = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.month.strftime('%B %Y')} - Joined: {self.new_operators_joined}, Trained: {self.new_operators_trained}"






from django.db import models

class UnifiedDefectReport(models.Model):
    CATEGORY_CHOICES = [
        ('MSIL', 'MSIL'),
        ('Tier-1', 'Tier-1'),
        ('All Plants', 'All Plants'),
        ('CTQ', 'CTQ'),
    ]

    month = models.DateField()  # First day of the month
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)

    # Defect data
    total_defects = models.PositiveIntegerField(default=0)
    ctq_defects = models.PositiveIntegerField(default=0)

    # Internal rejection data (optional if category is 'Internal')
    total_internal_rejection = models.PositiveIntegerField(default=0)
    ctq_internal_rejection = models.PositiveIntegerField(default=0)

    # Tier-1 specific defect data
    tier1_total_defects = models.PositiveIntegerField(default=0)
    tier1_ctq_defects = models.PositiveIntegerField(default=0)

    def __str__(self):
        return (
            f"{self.category} - {self.month.strftime('%B %Y')} | "
            f"Total: {self.total_defects}, CTQ: {self.ctq_defects}, "
            f"Internal: {self.total_internal_rejection}, CTQ Internal: {self.ctq_internal_rejection}, "
            f"Tier-1 Total: {self.tier1_total_defects}, Tier-1 CTQ: {self.tier1_ctq_defects}"
        )










#################
#level 3
################


from django.db import models


class EmployeeMaster(models.Model):
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE, related_name='employee_records')

    doj = models.DateField(verbose_name="Date of Joining")
    trainer_name = models.CharField(max_length=100)
    process_name = models.CharField(max_length=100)
    line_name_or_no = models.CharField(max_length=100)
    document_number = models.CharField(max_length=50)
    revision_number_and_date = models.CharField(max_length=100)
    effective_date = models.DateField()
    retention_period_years = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.operator.name} ({self.operator.employee_code})"




class TrainingActivity(models.Model):
    employee = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE, related_name='activities')
    activity_no = models.PositiveIntegerField()
    activity_content = models.TextField()
    observance_standard = models.TextField(default="")

    
    day_15_result = models.CharField(max_length=10, blank=True, null=True)
    day_16_result = models.CharField(max_length=10, blank=True, null=True)
    day_17_result = models.CharField(max_length=10, blank=True, null=True)
    day_18_result = models.CharField(max_length=10, blank=True, null=True)
    day_19_result = models.CharField(max_length=10, blank=True, null=True)
    day_20_result = models.CharField(max_length=10, blank=True, null=True)
    day_21_result = models.CharField(max_length=10, blank=True, null=True)

    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Activity {self.activity_no} for {self.employee.name}"
    





#################
#level 2
################

class LevelTwoSkillTraining(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='leveltwo_skill_trainings')
    title = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.title}"
    


class LevelTwoSection(models.Model):
    skill_training = models.ForeignKey(LevelTwoSkillTraining, on_delete=models.CASCADE, related_name='leveltwo_sections')
    title = models.CharField(max_length=100)



class LevelTwoTopic(models.Model):
    section = models.ForeignKey(LevelTwoSection, on_delete=models.CASCADE, related_name='leveltwo_topics')
    title = models.CharField(max_length=100)



class LevelTwoSubTopic(models.Model):
    topic = models.ForeignKey(LevelTwoTopic, on_delete=models.CASCADE, related_name='leveltwo_subtopics')
    title = models.CharField(max_length=100)



from django.core.exceptions import ValidationError

class LevelTwoUnit(models.Model):
    topic = models.ForeignKey(LevelTwoTopic, on_delete=models.CASCADE, related_name='leveltwo_units', null=True, blank=True)
    subtopic = models.ForeignKey(LevelTwoSubTopic, on_delete=models.CASCADE, related_name='leveltwo_units', null=True, blank=True)
    day = models.ForeignKey('Days', on_delete=models.CASCADE, related_name='leveltwo_units')
    content = models.TextField()

    def clean(self):
        if not self.topic and not self.subtopic:
            raise ValidationError("At least one of 'topic' or 'subtopic' must be provided.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Triggers clean() method
        super().save(*args, **kwargs)

    def __str__(self):
        topic_title = self.topic.title if self.topic else "No Topic"
        subtopic_title = self.subtopic.title if self.subtopic else "No Subtopic"
        return f"Unit for {subtopic_title} under {topic_title} on {self.day.day}"



class LevelTwoSubUnit(models.Model):
    unit = models.ForeignKey(LevelTwoUnit, on_delete=models.CASCADE, related_name='subunits')
    title = models.CharField(max_length=100)

    def __str__(self):
        return f"SubUnit: {self.title} (Unit ID: {self.unit.id})"


class LevelTwoTrainingContent(models.Model):
    subunit = models.ForeignKey('LevelTwoSubUnit', on_delete=models.CASCADE, related_name='leveltwo_contents',default='')
    description = models.TextField()

    training_file = models.FileField(upload_to='training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
     return f"Content for {self.subunit.title}"
    


# Notification IJL


from django.db import models
from datetime import timedelta, date

class OperatorLevelTracking(models.Model):
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE, related_name='level_trackings')
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    day = models.PositiveIntegerField()  # e.g., Day 11, Day 15

    @property
    def milestone_date(self):
        if self.operator.date_of_join:
            return self.operator.date_of_join + timedelta(days=self.day)
        return None

    def is_today_milestone(self):
        return self.milestone_date == date.today()

    def __str__(self):
        return f"{self.operator.full_name} - {self.level.name} - Day {self.day}"

from django.db import models
from datetime import timedelta, date

class OperatorLevelEmailTracking(models.Model):
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE, related_name='email_level_trackings')
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    day = models.PositiveIntegerField()

    @property
    def milestone_date(self):
        if self.operator.date_of_join:
            return self.operator.date_of_join + timedelta(days=self.day)
        return None

    def is_today_milestone(self):
        return self.milestone_date == date.today()

    def __str__(self):
        return f"{self.operator.full_name} - {self.level.name} - Day {self.day}"
    

class TrackingEmail(models.Model):
    tracking = models.ForeignKey(OperatorLevelEmailTracking, on_delete=models.CASCADE, related_name='emails')
    email = models.EmailField()

    def __str__(self):
        return self.email


# AR-VR IJL

from django.db import models

class ARVRTrainingContent(models.Model):
    description = models.TextField()
    arvr_file = models.FileField(upload_to='arvr_files/', blank=True, null=True)
    url_link = models.TextField(max_length=500, blank=True, null=True)
    def _str_(self):
        return f"AR/VR Content - {self.description[:30]}..."



#10 cycle check sheet  IJL

from django.db import models

DAY_CHOICES = [
    ('Day 1', 'Day 1'),
    ('Day 2', 'Day 2'),
    ('Day 3', 'Day 3'),
    ('Day 4', 'Day 4'),
    ('Day 5', 'Day 5'),
    ('Day 6', 'Day 6'),
]

class OperatorPerformanceEvaluation(models.Model):     # 10 cycle basic details
    cc_no = models.ForeignKey(OperatorMaster,on_delete=models.CASCADE)
    date = models.DateField()
    shift= models.CharField(max_length=20)
    line = models.CharField(max_length=100)
    process_name = models.CharField(max_length=100)
    operation_no = models.CharField(max_length=50)
    date_of_retraining_completed = models.DateField(null=True, blank=True)
    prepared_by = models.CharField(max_length=100,null=True,blank=True)
    checked_by = models.CharField(max_length=100, null=True, blank=True)
    approved_by = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.cc_no}"

class Tencycletopics(models.Model):                    # 10 cycle topics
    slno=models.IntegerField()
    cycle_topics = models.CharField(max_length=200)
    sub_topic = models.CharField(max_length=200,null=True, blank=True)  
    score_required = models.IntegerField()

    def __str__(self):
        return f"{self.slno} - {self.cycle_topics} (Score Required: {self.score_required})"

class OperatorEvaluation(models.Model):                #day1 to day6
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    

    def __str__(self):
        return f"{self.day} "

class EvaluationTopicMarks(models.Model):             #score saving model
    employee = models.ForeignKey(OperatorPerformanceEvaluation,on_delete=models.CASCADE, related_name='employeess' )
    topic_name = models.ForeignKey(Tencycletopics, on_delete=models.CASCADE, related_name='topics')
    days = models.ForeignKey('OperatorEvaluation', on_delete=models.CASCADE, related_name='topics')
    
    

    # 10 cycles for each topic
    mark_1 = models.IntegerField( null=True, blank=True)
    mark_2 = models.IntegerField( null=True, blank=True)
    mark_3 = models.IntegerField( null=True, blank=True)
    mark_4 = models.IntegerField( null=True, blank=True)
    mark_5 = models.IntegerField( null=True, blank=True)
    mark_6 = models.IntegerField( null=True, blank=True)
    mark_7 = models.IntegerField( null=True, blank=True)
    mark_8 = models.IntegerField( null=True, blank=True)
    mark_9 = models.IntegerField( null=True, blank=True)
    mark_10 = models.IntegerField( null=True, blank=True)

    class Meta:
        unique_together = ('employee', 'topic_name', 'days')

    def __str__(self):
        return f"{self.topic_name}"



#for level 2 10 cylce new

from django.db import models

DAY_CHOICES = [
    ('Day 1', 'Day 1'),
    ('Day 2', 'Day 2'),
    ('Day 3', 'Day 3'),
    ('Day 4', 'Day 4'),
    ('Day 5', 'Day 5'),
    ('Day 6', 'Day 6'),
]

class OperatorPerformanceEvaluationLevel(models.Model):     # 10 cycle basic details
    cc_no_l = models.ForeignKey(OperatorMaster,on_delete=models.CASCADE)
    date_l = models.DateField()
    shift_l= models.CharField(max_length=20)
    line_l = models.CharField(max_length=100)
    process_name_l = models.CharField(max_length=100)
    operation_no_l = models.CharField(max_length=50)
    date_of_retraining_completed_l = models.DateField(null=True, blank=True)
    prepared_by_l = models.CharField(max_length=100,null=True,blank=True)
    checked_by_l = models.CharField(max_length=100, null=True, blank=True)
    approved_by_l = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.cc_no_l}"

class TencycletopicsLevel(models.Model):                    # 10 cycle topics
    slno_l=models.IntegerField()
    cycle_topics_l = models.CharField(max_length=200)
    sub_topic_l = models.CharField(max_length=200,null=True, blank=True)  
    score_required_l = models.IntegerField()

    def __str__(self):
        return f"{self.slno_l} - {self.cycle_topics_l} (Score Required: {self.score_required_l})"

class OperatorEvaluationLevel(models.Model):                #day1 to day6
    # employee = models.ForeignKey(OperatorPerformanceEvaluation, on_delete=models.CASCADE)
    day_l = models.CharField(max_length=10, choices=DAY_CHOICES)
    

    def __str__(self):
        return f"{self.day_l} "

class EvaluationTopicMarksLevel(models.Model):             #score saving model
    employee_l = models.ForeignKey(OperatorPerformanceEvaluationLevel,on_delete=models.CASCADE, related_name='employeess_level' )
    topic_name_l = models.ForeignKey(TencycletopicsLevel, on_delete=models.CASCADE, related_name='topics_level')
    days_l = models.ForeignKey('OperatorEvaluationLevel', on_delete=models.CASCADE, related_name='topics_level')


    # 10 cycles for each topic
    mark_1 = models.IntegerField( null=True, blank=True)
    mark_2 = models.IntegerField( null=True, blank=True)
    mark_3 = models.IntegerField( null=True, blank=True)
    mark_4 = models.IntegerField( null=True, blank=True)
    mark_5 = models.IntegerField( null=True, blank=True)
    mark_6 = models.IntegerField( null=True, blank=True)
    mark_7 = models.IntegerField( null=True, blank=True)
    mark_8 = models.IntegerField( null=True, blank=True)
    mark_9 = models.IntegerField( null=True, blank=True)
    mark_10 = models.IntegerField( null=True, blank=True)

    class Meta:
        unique_together = ('employee_l', 'topic_name_l', 'days_l')

    def __str__(self):
        return f"{self.topic_name_l}"




#  Skill  Matrix IJL
class SkillMatrix(models.Model):
    department = models.CharField(max_length=100)
    updated_on = models.DateField()
    next_review = models.DateField()
    doc_no = models.CharField(max_length=50)
    prepared_by = models.CharField(max_length=100, blank=True, null=True)
    uploaded_by = models.CharField(max_length=100, blank=True, null=True)
    

    def _str_(self):
        return f"{self.department} - {self.updated_on}"

# new section model

class Section(models.Model):
    department=models.ForeignKey(SkillMatrix, on_delete=models.CASCADE, related_name='departments',null=True,blank=True)
    name=models.CharField(max_length=100)

    def _str_(self):
        return self.name

class OperationList(models.Model):
    matrix = models.ForeignKey(SkillMatrix, on_delete=models.CASCADE, related_name='operations')
    section=models.ForeignKey(Section, on_delete=models.CASCADE, related_name='sections',blank=True,null=True)
    number=models.IntegerField()
    name = models.CharField(max_length=100)
    minimum_skill_required = models.IntegerField()
    

    def _str_(self):
        return self.name


class OperatorLevel(models.Model):
    skill_matrix = models.ForeignKey(SkillMatrix, on_delete=models.CASCADE)
    operation = models.ForeignKey(OperationList, on_delete=models.CASCADE)
    employee = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)
    level = models.IntegerField(default=0) 


    def _str_(self):  # ✅ Correct the method name
        return f"Level {self.level} ({self.employee.full_name})"

from django.utils.timezone import now

class MultiSkilling(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    employee = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)
    
    # Redundant fields from OperatorMaster
    employee_code = models.CharField(max_length=20, blank=True)
    full_name = models.CharField(max_length=100, blank=True)
    date_of_join = models.DateField(null=True, blank=True)
    designation = models.CharField(max_length=100, blank=True)

    department = models.ForeignKey(SkillMatrix, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True)
    operation = models.ForeignKey(OperationList, on_delete=models.CASCADE, null=True, blank=True)
    skill_level = models.CharField(max_length=20, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    remarks = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')

    def save(self, *args, **kwargs):
        # Auto-fill values from the related employee
        if self.employee:
            self.employee_code = self.employee.employee_code
            self.full_name = self.employee.full_name
            self.date_of_join = self.employee.date_of_join
            self.designation = self.employee.designation
        super().save(*args, **kwargs)
    @property
    def current_status(self):
        # If the date is today or in the past and status was scheduled, change to in-progress
        today = now().date()
        if self.status == 'scheduled' and self.date and self.date <= today:
            return 'in-progress'
        # Otherwise use whatever is stored (scheduled or completed)
        return self.status

class MonthlySkill(models.Model):
    multiskilling = models.ForeignKey(MultiSkilling, on_delete=models.CASCADE, related_name='monthly_skills')
    operator_level = models.ForeignKey(OperatorLevel, on_delete=models.SET_NULL, null=True, blank=True, related_name='monthly_skills')

    @property
    def employee_code(self):
        return self.multiskilling.employee.employee_code

    @property
    def full_name(self):
        return self.multiskilling.employee.full_name

    @property
    def date_of_join(self):
        return self.multiskilling.employee.date_of_join

    @property
    def designation(self):
        return self.multiskilling.employee.designation

    @property
    def department(self):
        return self.multiskilling.department.department

    @property
    def section(self):
        return self.multiskilling.section.name if self.multiskilling.section else None

    @property
    def operation(self):
        return self.multiskilling.operation.name if self.multiskilling.operation else None

    @property
    def operation_number(self):
        return self.multiskilling.operation.number if self.multiskilling.operation else None

    @property
    def skill_level(self):
        return self.multiskilling.skill_level

    @property
    def date(self):
        return self.multiskilling.date

    @property
    def notes(self):
        return self.multiskilling.notes

    @property
    def level(self):
        return self.operator_level.level if self.operator_level else None

    def _str_(self):
        return f"MonthlySkill of {self.full_name} ({self.employee_code})"




from django.db import models
from django.core.exceptions import ValidationError

LEVEL_CHOICES = [
    (1, 'Level 1'),
    (2, 'Level 2'),
    (3, 'Level 3'),
    (4, 'Level 4'),
]

#  Machine allocation IJL

class Machine(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='machines/')
    level = models.IntegerField()
    process = models.CharField(max_length=100, null=True, blank=True)  # Skill required
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    



class MachineAllocationTrackingEmail(models.Model):
    email = models.EmailField()

    def __str__(self):
        return self.email




from django.core.exceptions import ValidationError

class MachineAllocation(models.Model):
    APPROVAL_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
]

    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    employee = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)
    allocated_at = models.DateTimeField(auto_now_add=True)
    approval_status = models.CharField(
        max_length=10,
        choices=APPROVAL_STATUS_CHOICES,
        default='approved'
    )

    def __str__(self):
        return f"{self.machine.name} → {self.employee.full_name}"
    


















# ==================== END: Signal Handler ====================

# ========================================================================
# END OF TRAINING AND TESTING MODELS SECTION
# ========================================================================


# ========================================================================
# 10 CYCLE OBSERVATION MODELS SECTION
# ========================================================================

# ==================== START: OperatorPerformanceEvaluation Model ====================

# ==================== END: OperatorPerformanceEvaluation Model ====================


# ==================== START: TrainingCycle Model ====================
class TrainingCycle(models.Model):
    """
    Model representing 10-cycle training observation data
    Tracks daily performance across multiple training cycles
    """
    evaluation = models.ForeignKey(OperatorPerformanceEvaluation, on_delete=models.CASCADE, related_name="training_cycles")
    cycle_number = models.PositiveIntegerField()
    day_1 = models.CharField(max_length=5, blank=True, null=True)
    day_2 = models.CharField(max_length=5, blank=True, null=True)
    day_3 = models.CharField(max_length=5, blank=True, null=True)
    day_4 = models.CharField(max_length=5, blank=True, null=True)
    day_5 = models.CharField(max_length=5, blank=True, null=True)
    day_6= models.CharField(max_length=5, blank=True, null=True)
    day_7= models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return f"Cycle {self.cycle_number} for {self.evaluation.operator}"
# ==================== END: TrainingCycle Model ====================


# ==================== START: JudgementCriteria Model ====================
class JudgementCriteria(models.Model):
    """
    Model for evaluation judgement criteria
    Stores evaluation parameters, contents, and judgements
    """
    evaluation = models.ForeignKey(OperatorPerformanceEvaluation, on_delete=models.CASCADE, related_name="judgement_criteria")
    sr_no = models.IntegerField()
    parameter = models.CharField(max_length=100)
    contents = models.TextField()
    judgement = models.CharField(max_length=5, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.parameter} - {self.evaluation.operator}"
# ==================== END: JudgementCriteria Model ====================

# Constants for judgement symbols (used in forms/validations)
JUDGEMENT_SYMBOLS = {
    "O": "Clear",
    "Δ": "Partial",
    "X": "Unclear"
}

# ========================================================================
# END OF 10 CYCLE OBSERVATION MODELS SECTION
# ========================================================================


# ========================================================================
# PERSONNEL OBSERVANCE SHEET MODELS SECTION
# ========================================================================

# ==================== START: Process Model ====================
class Process(models.Model):
    """
    Model representing manufacturing processes
    Links processes to specific production lines
    """
    name = models.CharField(max_length=100)
    line_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.line_name}"
# ==================== END: Process Model ====================


# ==================== START: ObservationItem Model ====================
class ObservationItem(models.Model):
    """
    Model for standardized observation items
    Defines observation criteria for different skill levels
    """
    LEVEL_1 = "1"
    LEVEL_2 = "2"
    LEVEL_3 = "3"
    LEVEL_4 = "4"

    LEVEL_CHOICES = [
        (LEVEL_1, "Level 1"),
        (LEVEL_2, "Level 2"),
        (LEVEL_3, "Level 3"),
        (LEVEL_4, "Level 4"),
    ]

    sno = models.PositiveIntegerField()
    level = models.CharField(max_length=1, choices=LEVEL_CHOICES)
    content = models.TextField()
    observance_standard = models.TextField()

    def __str__(self):
        return f"{self.get_level_display()} - Q{self.sno}"
# ==================== END: ObservationItem Model ====================


# ==================== START: PersonnelObservanceSheet Model ====================
class PersonnelObservanceSheet(models.Model):
    """
    Model for personnel observance evaluation sheets
    Main container for operator observations and approvals
    """
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE, related_name="observance_sheets")
    process = models.ForeignKey(Process, on_delete=models.CASCADE, related_name="observance_sheets")
    date = models.DateField(auto_now_add=True)
    result = models.CharField(max_length=10, blank=True)  # Overall result: Pass/Fail
    prepared_by = models.CharField(max_length=100)
    checked_by = models.CharField(max_length=100)
    approved_by = models.CharField(max_length=100)
    section_head_sign = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Observance Sheet - {self.operator.name} - {self.date}"
# ==================== END: PersonnelObservanceSheet Model ====================


# ==================== START: ObservationResult Model ====================
class ObservationResult(models.Model):
    """
    Model storing individual observation results
    Records pass/fail status for each observation item
    """
    sheet = models.ForeignKey(PersonnelObservanceSheet, on_delete=models.CASCADE, related_name="results")
    observation_item = models.ForeignKey(ObservationItem, on_delete=models.CASCADE)
    result = models.BooleanField()  # True = Pass (✓), False = Fail (X)

    def __str__(self):
        return f"{self.observation_item} - {'Pass' if self.result else 'Fail'}"
# ==================== END: ObservationResult Model ====================


# ==================== START: ObservationFailurePoint Model ====================
class ObservationFailurePoint(models.Model):
    """
    Model tracking specific failure points in observations
    Manages retraining requirements and signatures
    """
    sheet = models.ForeignKey(PersonnelObservanceSheet, on_delete=models.CASCADE, related_name="failures")
    observation_item = models.ForeignKey(ObservationItem, on_delete=models.SET_NULL, null=True, blank=True)
    observation_note = models.TextField()
    retraining_date = models.DateField(null=True, blank=True)
    trainee_sign = models.CharField(max_length=100)
    trainer_sign = models.CharField(max_length=100)

    def __str__(self):
        return f"Failure Point - {self.sheet.operator.name}"
# ==================== END: ObservationFailurePoint Model ====================


# ==================== START: Evaluation Model ====================
class Evaluation(models.Model):
    """
    Model for multi-round evaluation tracking
    Manages confirmation status across evaluation rounds
    """
    ROUND_1 = 1
    ROUND_2 = 2
    ROUND_3 = 3

    ROUND_CHOICES = [
        (ROUND_1, "1st"),
        (ROUND_2, "2nd"),
        (ROUND_3, "3rd"),
    ]

    failure_point = models.ForeignKey(ObservationFailurePoint, on_delete=models.CASCADE, related_name="evaluations")
    round_number = models.PositiveSmallIntegerField(choices=ROUND_CHOICES)
    confirmed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('failure_point', 'round_number')

    def __str__(self):
        return f"Evaluation Round {self.round_number} - {'Pass' if self.confirmed else 'Fail'}"
# ==================== END: Evaluation Model ====================

# ========================================================================
# END OF PERSONNEL OBSERVANCE SHEET MODELS SECTION
# ========================================================================


# ========================================================================
# RE-TRAINING EFFECTIVENESS CONFIRMATION MODELS SECTION
# ========================================================================

# ==================== START: Trainer Model ====================
class Trainer(models.Model):
    """
    Model representing trainers in the system
    Manages trainer information and line assignments
    """
    name = models.CharField(max_length=100)
    line_no = models.CharField(max_length=20)

    def __str__(self):
        return self.name
# ==================== END: Trainer Model ====================


# ==================== START: ReTrainingConfirmation Model ====================
class ReTrainingConfirmation(models.Model):
    """
    Model for re-training effectiveness confirmation
    Main container for retraining process tracking
    """
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)  # Fixed missing class reference
    trainer = models.ForeignKey(Trainer, on_delete=models.SET_NULL, null=True)
    process_name = models.CharField(max_length=100)
    line_name_or_no = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    document_no = models.CharField(max_length=100)
    retantion_period = models.CharField(max_length=100)
    effective_date =  models.CharField(max_length=100)
    rev_no_date = models.CharField(max_length=100)




    def __str__(self):
        return f"Retraining for {self.operator}"
# ==================== END: ReTrainingConfirmation Model ====================


# ==================== START: Observation Model (ReTraining) ====================
class Observation(models.Model):
    """
    Model for retraining observation tracking
    Manages failure points and multi-stage confirmation process
    """
    retraining_form = models.ForeignKey(ReTrainingConfirmation,on_delete=models.CASCADE,related_name='observations')
    serial_no = models.PositiveIntegerField()
    failure_point = models.TextField()
    retraining_date = models.DateField(null=True, blank=True)

    # Choices for confirmation fields
    CONFIRM_CHOICES = [
        ('○', 'Satisfactory'),
        ('△', 'Needs Retraining')
    ]

    confirm_1 = models.CharField(max_length=2, choices=CONFIRM_CHOICES, blank=True)
    confirm_2 = models.CharField(max_length=2, choices=CONFIRM_CHOICES, blank=True)
    confirm_3 = models.CharField(max_length=2, choices=CONFIRM_CHOICES, blank=True)

    trainee_sign = models.CharField(max_length=100, blank=True)
    trainer_sign = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Observation {self.serial_no} - {self.failure_point[:30]}"
# ==================== END: Observation Model (ReTraining) ====================

# ========================================================================
# END OF RE-TRAINING EFFECTIVENESS CONFIRMATION MODELS SECTION
# ========================================================================


# ========================================================================
# SKILL MATRIX MODELS SECTION - GRINDING OPERATIONS
# ========================================================================

# ==================== START: Operation Model ====================
class Operation(models.Model):
    """
    Model representing manufacturing operations
    Defines operations with skill requirements and criticality levels
    """
    name = models.CharField(max_length=100)
    minimum_skill_required = models.IntegerField(default=3)
    is_critical = models.BooleanField(default=False)
    is_critical2 = models.BooleanField(default=False)  # Consider renaming this for clarity

    def __str__(self):
        return self.name
# ==================== END: Operation Model ====================


# ==================== START: Employee Model ====================
class Employee(models.Model):
    """
    Model representing employees in the skill matrix system
    Manages employee basic information and joining dates
    """
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20,default='')
    date_of_joining = models.DateField()

    def __str__(self):
        return f"{self.name} ({self.code})"
# ==================== END: Employee Model ====================


# ==================== START: SkillEntry Model ====================
class SkillEntry(models.Model):
    """
    Model representing individual skill entries in the skill matrix
    Links employees to operations with skill levels and certification data
    """
    SKILL_LEVEL_CHOICES = [
        (0, 'Not allowed'),
        (1, 'Can work under supervision'),
        (2, 'Can work independently'),
        (3, 'Can train others')
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='skills')
    operation = models.ForeignKey(Operation, on_delete=models.CASCADE)
    skill_level = models.IntegerField(choices=SKILL_LEVEL_CHOICES, default=0)
    certified_date = models.DateField(null=True, blank=True)

    # Renamed for clarity
    number_of_statuses = models.PositiveIntegerField()  # Renamed from `nos_of_skill_status`
    remarks = models.CharField(max_length=200, blank=True)  # Added `blank=True` for optional field
    total_skilled_persons = models.PositiveIntegerField()   # Renamed from `total_man_skilled`
    skill_percentage = models.PositiveIntegerField()        # Renamed from `total_per_skilled`

    class Meta:
        unique_together = ('employee', 'operation')

    def __str__(self):
        return f"{self.employee} - {self.operation} - Level {self.skill_level}"
# ==================== END: SkillEntry Model ====================


# ==================== START: SkillMatrixMetadata Model ====================
class SkillMatrixMetadata(models.Model):
    """
    Model for skill matrix metadata and approval tracking
    Manages departmental skill matrix review cycles and approvals
    """
    department = models.CharField(max_length=200)
    updated_on = models.DateField()
    next_review_date = models.DateField()
    reviewed_by = models.CharField(max_length=100)
    prepared_by = models.CharField(max_length=100, null=True, blank=True)
    approved_by = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.department} - {self.updated_on}"
# ==================== END: SkillMatrixMetadata Model ====================

# ========================================================================
# END OF SKILL MATRIX MODELS SECTION
# ========================================================================


# ==================== EASY TEST ====================

class Station(models.Model):
    station_number = models.IntegerField(unique=True)
    skill = models.CharField(max_length=100,default='')
    minimum_skill_required = models.CharField(max_length=100)
    min_operator_required = models.IntegerField()

    def __str__(self):
        return f"Station {self.station_number}"
    

from django.db import models

class KeyEvent(models.Model):
    base_id = models.IntegerField()
    key_id = models.IntegerField()
    key_sn = models.CharField(max_length=255, default='unknown')
    mode = models.IntegerField()
    timestamp = models.DateTimeField()
    info = models.CharField(max_length=255)
    client_timestamp = models.DateTimeField()
    event_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class ConnectEvent(models.Model):
    base_id = models.IntegerField()
    mode = models.IntegerField()
    info = models.CharField(max_length=255)
    timestamp = models.DateTimeField()




class VoteEvent(models.Model):
    base_id = models.IntegerField()
    mode = models.IntegerField()
    info = models.CharField(max_length=255)
    timestamp = models.DateTimeField()

# dynamic quesitions 

# models.py

class QuizQuestionPaper(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class QuizQuestion(models.Model):
    question_paper = models.ForeignKey(QuizQuestionPaper, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    question_text = models.CharField(max_length=255)
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_index = models.IntegerField(choices=[(i, chr(65+i)) for i in range(4)])

    def __str__(self):
        return self.question_text

    def get_options(self):
        return [self.option_a, self.option_b, self.option_c, self.option_d]


class TestSession(models.Model):
    test_name = models.CharField(max_length=100)
    key_id = models.CharField(max_length=10)
    employee = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    skill = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True)
    question_paper = models.ForeignKey(QuizQuestionPaper, on_delete=models.CASCADE, related_name='test_sessions', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('test_name', 'key_id')

    def __str__(self):
        return f"{self.test_name} - {self.key_id} ({self.employee.full_name})"

    @property
    def skill_name(self):
        """Get skill name from Station model"""
        return self.skill.skill if self.skill else None

    @property
    def level_number(self):
        """Get level number from Level model"""
        return self.level.name if self.level else None



# models.py
class Score(models.Model):
    employee = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE)
    marks = models.IntegerField()
    test_name = models.CharField(max_length=100, blank=True)
    test = models.ForeignKey(QuizQuestionPaper, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    skill = models.ForeignKey(Station, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    percentage = models.FloatField(default=0)
    passed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.employee.full_name} - {self.marks} marks"

    @property
    def skill_name(self):
        """Get skill name from Station model"""
        return self.skill.skill if self.skill else None

    @property
    def level_number(self):
        """Get level number from Level model"""
        return self.level.name if self.level else None

    def update_skill_matrix(self):
        """Update OperatorLevel in skill matrix when employee passes exam"""
        from django.db import transaction
        import time
        import random

        if not self.passed:
            print(f"Score {self.id}: Employee did not pass (score: {self.percentage}%)")
            return None

        if not self.skill:
            print(f"Warning: No skill assigned for score {self.id}")
            return None

        if not self.level:
            print(f"Warning: No level assigned for score {self.id}")
            return None

        # Retry logic for database lock issues
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Add small random delay to prevent simultaneous operations
                if attempt > 0:
                    delay = random.uniform(0.1, 0.5)
                    time.sleep(delay)
                    print(f"Retrying skill matrix update for {self.employee.full_name} (attempt {attempt + 1})")

                # Use atomic transaction to ensure data consistency
                with transaction.atomic():
                    # Find or create corresponding operation in OperationList
                    # First try exact match, then case-insensitive
                    operation = OperationList.objects.filter(name=self.skill.skill).first()
                    if not operation:
                        operation = OperationList.objects.filter(name__iexact=self.skill.skill).first()

                    if not operation:
                        # Create new operation if it doesn't exist
                        print(f"Creating new operation for skill: {self.skill.skill}")

                        # Find appropriate skill matrix based on skill name
                        skill_matrix = self.get_skill_matrix_for_skill(self.skill.skill)
                        if not skill_matrix:
                            print(f"Warning: No appropriate skill matrix found for skill '{self.skill.skill}'")
                            return None

                        # Use get_or_create to handle race conditions
                        operation, created = OperationList.objects.get_or_create(
                            name=self.skill.skill,
                            defaults={
                                'matrix': skill_matrix,
                                'minimum_skill_required': 1,
                                'number': 1
                            }
                        )
                        if created:
                            print(f"Created new operation: {operation.name} in {skill_matrix.department}")
                        else:
                            print(f"Operation already exists: {operation.name}")

                    # Get skill matrix from operation
                    skill_matrix = operation.matrix
                    if not skill_matrix:
                        print(f"Warning: No skill matrix found for operation '{operation.name}'")
                        return None

                    level_number = self.get_level_number()
                    if level_number < 1:
                        print(f"Warning: Invalid level number {level_number} for score {self.id}")
                        return None

                    # Handle potential duplicates - get or create, but handle multiple objects
                    try:
                        operator_level = OperatorLevel.objects.get(
                            skill_matrix=skill_matrix,
                            operation=operation,
                            employee=self.employee
                        )
                        created = False
                    except OperatorLevel.DoesNotExist:
                        operator_level = OperatorLevel.objects.create(
                            skill_matrix=skill_matrix,
                            operation=operation,
                            employee=self.employee,
                            level=level_number
                        )
                        created = True
                    except OperatorLevel.MultipleObjectsReturned:
                        # Handle duplicates - delete all and create new one
                        print(f"⚠️  Found duplicate OperatorLevel entries, cleaning up...")
                        OperatorLevel.objects.filter(
                            skill_matrix=skill_matrix,
                            operation=operation,
                            employee=self.employee
                        ).delete()

                        operator_level = OperatorLevel.objects.create(
                            skill_matrix=skill_matrix,
                            operation=operation,
                            employee=self.employee,
                            level=level_number
                        )
                        created = True

                    # If exists and new level is higher, update it
                    if not created and level_number > operator_level.level:
                        operator_level.level = level_number
                        operator_level.save()
                        print(f"✅ Updated skill matrix: {self.employee.full_name} - {operation.name} - Level {level_number}")
                    elif created:
                        print(f"✅ Created skill matrix entry: {self.employee.full_name} - {operation.name} - Level {level_number}")
                    else:
                        print(f"ℹ️  Skill matrix unchanged: {self.employee.full_name} already has Level {operator_level.level} or higher for {operation.name}")

                    return operator_level

            except Exception as e:
                error_msg = str(e)
                print(f"❌ Error updating skill matrix for score {self.id} (attempt {attempt + 1}): {error_msg}")

                # Check if it's a database lock error and we can retry
                if "database is locked" in error_msg.lower() and attempt < max_retries - 1:
                    print(f"Database locked, will retry in a moment...")
                    continue
                else:
                    # If it's the last attempt or a different error, log and return
                    import traceback
                    traceback.print_exc()
                    return None

        # If all retries failed
        print(f"❌ Failed to update skill matrix for score {self.id} after {max_retries} attempts")
        return None

    def get_skill_matrix_for_skill(self, skill_name):
        """Determine which skill matrix department a skill belongs to"""
        skill_lower = skill_name.lower()

        # Assembly skills
        assembly_keywords = ['assy', 'assembly', 'bracket', 'body', 'ref', 'pcb', 'bezel', 'cord', 'bulb', 'filter', 'cap', 'lens', 'holder', 'drl', 'sub']
        if any(keyword in skill_lower for keyword in assembly_keywords):
            return SkillMatrix.objects.filter(department__icontains='assembly').first()

        # Moulding skills
        moulding_keywords = ['moulding', 'molding', 'bmc', 'pc lens', 'extension', 'rcl lens']
        if any(keyword in skill_lower for keyword in moulding_keywords):
            return SkillMatrix.objects.filter(department__icontains='moulding').first()

        # Surface Treatment skills
        surface_keywords = ['welding', 'annealing', 'hot plate', 'ultrasonic', 'laser', 'grease', 'impulse', 'glue', 'dispensing']
        if any(keyword in skill_lower for keyword in surface_keywords):
            return SkillMatrix.objects.filter(department__icontains='surface').first()

        # Quality skills
        quality_keywords = ['inspection', 'gauge', 'measurement', 'leak', 'light', 'testing', 'checking', 'photometric']
        if any(keyword in skill_lower for keyword in quality_keywords):
            return SkillMatrix.objects.filter(department__icontains='quality').first()

        # Default to Assembly if no match
        return SkillMatrix.objects.filter(department__icontains='assembly').first() or SkillMatrix.objects.first()

    def get_level_number(self):
        """Extract numeric level from Level model"""
        if self.level and self.level.name:
            # Extract number from level name (e.g., 'level_2' -> 2)
            import re
            match = re.search(r'(\d+)', self.level.name)
            return int(match.group(1)) if match else 1
        return 1


# Signal handler to automatically update skill matrix when score is created
@receiver(post_save, sender=Score)
def update_skill_matrix_on_score_save(sender, instance, created, **kwargs):
    """
    Automatically update skill matrix when a score is created or updated and employee passes
    """
    from django.db import transaction

    print(f"🔔 Signal triggered for Score {instance.id}: created={created}, passed={instance.passed}")

    # Update skill matrix for both new and updated scores if they pass
    if instance.passed:
        try:
            # Use transaction.on_commit to ensure the signal runs after the current transaction
            def update_skill_matrix():
                try:
                    result = instance.update_skill_matrix()
                    if result:
                        print(f"🎉 Signal: Successfully updated skill matrix for {instance.employee.full_name}")
                    else:
                        print(f"⚠️  Signal: Failed to update skill matrix for {instance.employee.full_name}")
                except Exception as e:
                    print(f"❌ Signal error: Failed to update skill matrix for score {instance.id}: {str(e)}")
                    import traceback
                    traceback.print_exc()

            # Schedule the skill matrix update to run after the current transaction commits
            transaction.on_commit(update_skill_matrix)

        except Exception as e:
            print(f"❌ Signal error: Failed to schedule skill matrix update for score {instance.id}: {str(e)}")
            import traceback
            traceback.print_exc()
    else:
        print(f"ℹ️  Signal: Score {instance.id} did not pass, no skill matrix update needed")


from django.db import models

class CompanyLogo(models.Model):
    name = models.CharField(max_length=100, default="Company Logo")  # Optional: Name of the logo (e.g., company name)
    logo = models.ImageField(upload_to='logos/',blank=True,null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return self.name or f"Logo {self.id}"



# Refreshment Training

#models.py

class Training_category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Curriculum(models.Model):
    category = models.ForeignKey(Training_category, on_delete=models.CASCADE, related_name='topics')
    topic = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("category", "topic")
        ordering = ["topic"]

    def __str__(self):
        return f"{self.category.name} > {self.topic}"

class CurriculumContent(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('link', 'Link'),  
    ]

    curriculum = models.ForeignKey('Curriculum', on_delete=models.CASCADE, related_name='contents')
    content_name = models.CharField(max_length=200)
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)

    file = models.FileField(upload_to='training_contents/', null=True, blank=True)
    link = models.URLField(null=True, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content_name

class Trainer_name(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Venues(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Schedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]

    training_category = models.ForeignKey(Training_category, on_delete=models.CASCADE, related_name='scheduled_categories')
    training_name = models.ForeignKey(Curriculum, on_delete=models.CASCADE, related_name='scheduled_topics')
    
    trainer = models.ForeignKey(Trainer_name, on_delete=models.SET_NULL, null=True)
    venue = models.ForeignKey(Venues, on_delete=models.SET_NULL, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    date = models.DateField()
    time = models.TimeField()

    employees = models.ManyToManyField("OperatorMaster", related_name='schedules') 

    def __str__(self):
        return f"{self.training_name.topic} on {self.date}"

class EmployeeAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('rescheduled', 'Rescheduled'),
    ]

    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='attendances')
    employee = models.ForeignKey('OperatorMaster', on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    notes = models.TextField(blank=True, null=True)  

    # For rescheduling
    reschedule_date = models.DateField(blank=True, null=True)
    reschedule_time = models.TimeField(blank=True, null=True)
    reschedule_reason = models.TextField(blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('schedule', 'employee')

    def __str__(self):
        return f"{self.employee} - {self.schedule} - {self.status}"


class RescheduleLog(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='reschedule_logs')
    employee = models.ForeignKey('OperatorMaster', on_delete=models.CASCADE, related_name='reschedule_logs')
    original_date = models.DateField()
    original_time = models.TimeField()
    new_date = models.DateField()
    new_time = models.TimeField()
    reason = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Reschedule for {self.employee} on {self.schedule}"


class AdvancedManpowerCTQ(models.Model):
    month_year_ctq = models.DateField()
    total_stations_ctq = models.IntegerField(null=True, blank=True)
    operator_required_ctq = models.IntegerField(null=True, blank=True)
    operator_availability_ctq = models.IntegerField(null=True, blank=True)
    buffer_manpower_required_ctq = models.IntegerField(null=True, blank=True)
    buffer_manpower_availability_ctq = models.IntegerField(null=True, blank=True)
    attrition_trend_ctq = models.IntegerField(null=True, blank=True)
    absentee_trend_ctq = models.IntegerField(null=True, blank=True)
    planned_units_ctq = models.IntegerField(null=True, blank=True)
    actual_production_ctq = models.IntegerField(null=True, blank=True)
    

    # New relations
    factory = models.ForeignKey('Factory', on_delete=models.CASCADE, related_name='ctq_records', null=True, blank=True)
    department = models.ForeignKey('Department', on_delete=models.CASCADE, related_name='ctq_records', null=True, blank=True)

    def _str_(self):
        return f"{self.month_year_ctq.strftime('%b %y')} - {self.factory.name} - {self.department.name}"


class ManagementReview(models.Model):
    month_year = models.DateField()
    new_operators_joined = models.IntegerField()
    new_operators_trained = models.IntegerField()
    total_training_plans = models.IntegerField()
    total_trainings_actual = models.IntegerField()
    total_defects_msil = models.IntegerField()
    ctq_defects_msil = models.IntegerField()
    total_defects_tier1 = models.IntegerField()
    ctq_defects_tier1 = models.IntegerField()
    total_internal_rejection = models.IntegerField()
    ctq_internal_rejection = models.IntegerField()

    def _str_(self):
        return self.month_year.strftime('%b %y')

class OperatorRequirement(models.Model):
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='operator_requirements')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='operator_requirements')
    month = models.DateField(help_text="Any date in the month (used for month tracking)")
    level = models.IntegerField(help_text="Skill level or grade")
    operator_required = models.PositiveIntegerField()
    operator_available = models.PositiveIntegerField()

    def _str_(self):
        return f"{self.factory.name} - {self.department.name} | Level {self.level} - {self.month.strftime('%B %Y')}"# level2fileuploading

from django.db import models

class L2FileUpload(models.Model):
    description = models.TextField()
    l2_file = models.FileField(upload_to='L2file_uploads/', blank=True, null=True)
    url_link = models.TextField(max_length=500, blank=True, null=True)
    def _str_(self):
        return f"L2 fileupload- {self.description[:30]}..."
    
# exam tool
from django.db import models

class UploadedFile(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')  # stores in MEDIA_ROOT/uploads/
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.title




class Level2TrainingContent(models.Model):
    topic = models.ForeignKey(LevelTwoTopic, on_delete=models.CASCADE, related_name='leveltwo_contents')
    description = models.CharField(max_length=200)
    training_file = models.FileField(upload_to='leveltwo_training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Content for {self.topic.title}"
    

from django.db import models

class Level3TrainingContent(models.Model):
    topic = models.ForeignKey(LevelTwoTopic, on_delete=models.CASCADE, related_name='levelthree_contents')
    description = models.CharField(max_length=200)
    training_file = models.FileField(upload_to='levelthree_training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Content for {self.topic.title}"



class SkillsList(models.Model):
    skill = models.CharField(max_length=255)

    def _str_(self):
        return self.skill



# hanchou 
class HanContent(models.Model):
    title = models.CharField(max_length=100, default='')

    def _str_(self):
        return self.title


class HanTrainingContent(models.Model):
    han_content = models.ForeignKey(HanContent, on_delete=models.CASCADE, related_name='contents')
    description = models.TextField()
    training_file = models.FileField(upload_to='training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)

    def _str_(self):
        return f"Training Content for {self.han_content.title}"
    
# end
# shoku chou
class ShoContent(models.Model):
    title = models.CharField(max_length=100, default='')

    def _str_(self):
        return self.title


class ShoTrainingContent(models.Model):
    sho_content = models.ForeignKey(ShoContent, on_delete=models.CASCADE, related_name='contents', default='')
    description = models.TextField()
    training_file = models.FileField(upload_to='training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)

    def _str_(self):
        return f"Content for {self.sho_content.title}"
# end

#Notification Real time


class Notification(models.Model):
    """
    Comprehensive notification model for real-time notifications
    Tracks all system events and user interactions
    """
    NOTIFICATION_TYPES = [
        ('employee_registration', 'Employee Registration'),
        ('level_exam_completed', 'Level Exam Completed'),  # Updated to match frontend
        ('training_added', 'Training Added'),
        ('training_updated', 'Training Updated'),
        ('training_scheduled', 'Training Scheduled'),
        ('training_completed', 'Training Completed'),
        ('training_reschedule', 'Training Reschedule'),  # Added for frontend compatibility
        ('refresher_training_scheduled', 'Refresher Training Scheduled'),
        ('refresher_training_completed', 'Refresher Training Completed'),
        ('bending_training_added', 'Bending Training Added'),  # Added for frontend compatibility
        ('level_promotion', 'Level Promotion'),
        ('skill_matrix_updated', 'Skill Matrix Updated'),
        ('machine_allocated', 'Machine Allocated'),
        ('test_assigned', 'Test Assigned'),
        ('evaluation_completed', 'Evaluation Completed'),
        ('milestone_reached', 'Milestone Reached'),
        ('system_alert', 'System Alert'),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)

    # Recipients
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    recipient_email = models.EmailField(null=True, blank=True)

    # Related objects
    operator = models.ForeignKey(OperatorMaster, on_delete=models.CASCADE, null=True, blank=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, null=True, blank=True)
    training_schedule = models.ForeignKey('Schedule', on_delete=models.CASCADE, null=True, blank=True)

    # Status tracking
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    # Additional metadata
    metadata = models.JSONField(default=dict, blank=True)  # For storing additional context
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ], default='medium')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.recipient or self.recipient_email}"

    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

    def mark_as_unread(self):
        """Mark notification as unread"""
        if self.is_read:
            self.is_read = False
            self.read_at = None
            self.save(update_fields=['is_read', 'read_at'])




#Level 0

from django.db import models
from django.db.models import Max
from datetime import datetime

class UserInfo(models.Model):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    first_name = models.CharField(
        max_length=50,
        help_text="User's first name",
        null=True,
        blank=True
    )
    last_name = models.CharField(
        max_length=50,
        help_text="User's last name",
        null=True,
        blank=True
    )
    temp_id = models.CharField(
        max_length=50,
        unique=True,
        editable=False,
        help_text="Auto-generated temporary ID for the user"
    )
    email = models.EmailField(
        unique=True,
        null=True,
        blank=True,
        help_text="User's email address (optional)"
    )
    phone_number = models.CharField(
        max_length=17,
        help_text="User's phone number (required)"
    )
    sex = models.CharField(
        max_length=1,
        choices=SEX_CHOICES,
        default='M',
        help_text="User's sex"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "User Information"
        verbose_name_plural = "User Information"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.temp_id})"
    
    def save(self, *args, **kwargs):
        if not self.temp_id:
            today = datetime.now().strftime("%d%m%y")
            prefix = f"TEMP{today}"
            max_seq = UserInfo.objects.filter(temp_id__startswith=prefix).aggregate(Max('temp_id'))['temp_id__max']
            current_seq = int(max_seq[-4:]) + 1 if max_seq else 1
            self.temp_id = f"{prefix}{current_seq:04d}"
        super().save(*args, **kwargs)



from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class HumanBodyCheck(models.Model):
    STATUS_CHOICES = [
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('pending', 'Pending'),
    ]
    
    temp_id = models.CharField(max_length=50)  # Temporary ID from the user
    check_date = models.DateTimeField(auto_now_add=True)
    overall_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # Physical Fitness Checks
    color_vision = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    eye_movement = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    fingers_functionality = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    hand_deformity = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    joint_mobility = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    hearing = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    bending_ability = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # Additional custom checks (stored as JSON)
    additional_checks = models.JSONField(default=list, blank=True)
    
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-check_date']
        verbose_name = 'Human Body Check'
        verbose_name_plural = 'Human Body Checks'

    def save(self, *args, **kwargs):
        # Calculate overall status before saving
        checks = [
            self.color_vision,
            self.eye_movement,
            self.fingers_functionality,
            self.hand_deformity,
            self.joint_mobility,
            self.hearing,
            self.bending_ability
        ]
        
        # Check additional checks
        for check in self.additional_checks:
            checks.append(check.get('status', 'pending'))
        
        if 'fail' in checks:
            self.overall_status = 'fail'
        elif all(status == 'pass' for status in checks):
            self.overall_status = 'pass'
        else:
            self.overall_status = 'pending'
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Check for {self.temp_id} - {self.get_overall_status_display()}"



#SDC 










from django.db import models

class SDCOrientationFeedback(models.Model):

    DEPARTMENT_CHOICES = [
    ('HR','HR'),
    ('SAFETY', 'SAFETY'),
    ('Moulding', 'Moulding'),
    ('Surface Treatment', 'Surface Treatment'),
    ('Assembly','Assembly'),
    ('QA','QA'),
    ('EMS','EMS'),
]
    user = models.ForeignKey('UserInfo', on_delete=models.CASCADE, related_name='orientation_feedbacks', default='')
    temp_id = models.CharField(max_length=100, blank=True, null=True)  # <-- Add this line

    date_of_training = models.DateField()
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    trainer_name = models.CharField(max_length=100)

    not_understood = models.CharField(max_length=50, blank=True)
    good = models.CharField(max_length=50, blank=True)
    very_good = models.CharField(max_length=50, blank=True)
    better = models.CharField(max_length=50, blank=True)
    best = models.CharField(max_length=50, blank=True)

    suggestion = models.TextField(blank=True, null=True)
    trainee_signature = models.CharField(max_length=100, blank=True)
    training_incharge_signature = models.CharField(max_length=100, blank=True)

    def _str_(self):
        if self.operator:
            return f"{self.operator.employee_code} - {self.department}"
        return f"Unknown Operator - {self.department}"

    @property
    def trainee_name(self):
        return self.operator.full_name if self.operator else "Unknown Operator"
    
    @property
    def sr_no(self):
        return self.operator.sr_no if self.operator else None
    
    @property
    def doj(self):
        return self.operator.date_of_join if self.operator else None