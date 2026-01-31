import os

paths = [
    r"c:\Users\el3attal\OneDrive\Desktop\dd\components",
    r"c:\Users\el3attal\OneDrive\Desktop\dd\pages"
]

# Even more aggressive replacements
replacements = {
    'text-slate-950': 'text-text',
    'text-slate-900': 'text-text',
    'text-slate-800': 'text-text',
    'text-black': 'text-text',
    'bg-slate-950': 'bg-primary',
    'bg-slate-900': 'bg-primary',
    'bg-slate-800': 'bg-primary',
    'bg-black': 'bg-primary',
    'border-slate-900': 'border-primary',
    'border-slate-800': 'border-primary',
}

for base_path in paths:
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".tsx"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for old, new in replacements.items():
                        new_content = new_content.replace(old, new)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
