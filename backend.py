import shutil
import os
import schedule
import time

# Relative path from the parent directory
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

source_dirs = {
    "Paper": os.path.join(parent_dir, "Vallhalla", "Paper"),
    "Live": os.path.join(parent_dir, "Vallhalla", "Live")
}

destination_dir = os.path.dirname(os.path.abspath(__file__)) # VALLHALLA_WEBSITE directory

def copy_paper_files():
    try:
        for subdir_name, source_dir in source_dirs.items():
            dest_subdir = os.path.join(destination_dir, subdir_name)
            if not os.path.exists(dest_subdir):
                os.makedirs(dest_subdir)

            for filename in os.listdir(source_dir):
                source_file = os.path.join(source_dir, filename)
                destination_file = os.path.join(dest_subdir, filename)
                if os.path.isfile(source_file):
                    shutil.copy2(source_file, destination_file)
                    print(f"Copied {filename} from {subdir_name}")

        print("Paper and Live files copied successfully!")
    except Exception as e:
        print(f"Error copying files: {e}")

def run_scheduled_copy():
    copy_paper_files()

# Schedule to run every 5 minutes (adjust as needed)


if __name__ == "__main__":
    copy_paper_files() # Run once on startup
    schedule.run_pending()
    while 0:
        schedule.run_pending()
        run_scheduled_copy
        time.sleep(1)
else:
    schedule.every(5).minutes.do(run_scheduled_copy)