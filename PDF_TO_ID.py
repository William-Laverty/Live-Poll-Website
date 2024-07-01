import PyPDF2
import re
import json
import os

def extract_student_data(pdf_path):
    # Open and read the PDF file
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        number_of_pages = len(reader.pages)
        
        text = ""
        for page_number in range(number_of_pages):
            page = reader.pages[page_number]
            text += page.extract_text()
    
    # Regular expression to find ID numbers and corresponding names
    pattern = re.compile(r'\*(\d{5})\*.*?\s+(\d{5})\s+([A-Za-z\-\']+)\s+([A-Za-z\-\']+)\s+\d')
    
    # Extract the data
    matches = pattern.findall(text)
    
    students = []
    for match in matches:
        id_number = match[1]
        last_name = match[2]
        first_name = match[3]
        full_name = f"{first_name} {last_name}"
        
        student = {
            "id": id_number,
            "lastName": last_name,
            "name": full_name,
            "isAdmin": False,
            "Rock": False,
            "4 and 20": False,
            "House Shout": False,
            "Instrumental": False
        }
        students.append(student)
    
    return students

def save_to_file(data, output_path):
    with open(output_path, "w") as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    pdf_path = input("Please enter the path to the PDF file: ").strip()
    output_path = os.path.join(os.path.dirname(pdf_path), "students.json")
    
    student_data = extract_student_data(pdf_path)
    save_to_file(student_data, output_path)
    
    print(f"Data has been extracted and saved to {output_path}")
