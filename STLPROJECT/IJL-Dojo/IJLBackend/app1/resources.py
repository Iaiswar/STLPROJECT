# resources.py
from import_export import resources, fields
from .models import OperatorMaster
from datetime import datetime

class OperatorMasterResource(resources.ModelResource):
    sr_no = fields.Field(attribute='sr_no', column_name='Sr No')
    employee_code = fields.Field(attribute='employee_code', column_name='Employee Code')
    full_name = fields.Field(attribute='full_name', column_name='Full Name')
    date_of_join = fields.Field(attribute='date_of_join', column_name='Date of Join')
    employee_pattern_category = fields.Field(attribute='employee_pattern_category', column_name='Employment Pattern (Category)')
    designation = fields.Field(attribute='designation', column_name='Designation')
    department = fields.Field(attribute='department', column_name='Department')
    department_code = fields.Field(attribute='department_code', column_name='Department Code')
    def before_import_row(self, row, **kwargs):
        if row.get('Date of Join'):
            try:
                # Fix Excel date string to date object
                row['Date of Join'] = datetime.strptime(row['Date of Join'], "%d-%m-%Y").date()
            except Exception as e:
                print("Date parsing error:", e)
    class Meta:
        model = OperatorMaster
        import_id_fields = ['employee_code']
        fields = (
            'sr_no',
            'employee_code',
            'full_name',
            'date_of_join',
            'employee_pattern_category',
            'designation',
            'department',
            'department_code',
        )
        skip_unchanged = True
        report_skipped = True