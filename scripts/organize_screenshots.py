import os
import shutil
import glob

SOURCE_DIR = r"C:\Users\shaik\.gemini\antigravity-ide\brain\3e529f44-796e-444e-bf9e-067e7bf53a63"
DEST_DIR = r"c:\Users\shaik\Documents\Campus-IQ\screenshots"

os.makedirs(DEST_DIR, exist_ok=True)

# Define mapping of feature names to patterns or exact files
FEATURE_MAP = [
    # Auth
    ("01_Authentication_Login_Page.png", ["login_page_*.png"], "Login page with 1-click Demo Student and Demo Admin shortcuts"),
    # Dashboard
    ("02_Personalized_Dashboard_Dark.png", ["dashboard_page_*.png"], "Dynamic Dashboard with live KPI stats cards and Recharts area volume chart"),
    ("03_Dashboard_Logged_In_Student.png", ["logged_in_dashboard_*.png"], "Personalized student dashboard with activity feed and quick action shortcuts"),
    # AI Assistant
    ("04_AI_Assistant_Workspace.png", ["assistant_page_*.png"], "Conversational AI workspace with starter question prompt cards and multiline composer"),
    ("05_AI_Assistant_Verified_FAQ_Response.png", ["assistant_response_loaded_*.png", "assistant_response_*.png"], "Verified FAQ match with confidence score and expandable knowledge citations"),
    ("06_AI_Assistant_MultiTurn_Followup.png", ["followup_response_*.png"], "Multi-turn context retention and dynamic follow-up suggestions"),
    ("07_AI_Assistant_Groq_LLM_Synthesis.png", ["ai_response_roadmap_*.png"], "Ultra-fast Groq LLM synthesis with Markdown tables, bold headers, and zero HTML tags"),
    # FAQ Explorer
    ("08_Explore_FAQs_Knowledge_Hub.png", ["explore_faqs_page_*.png"], "Searchable knowledge hub across 106 verified FAQs with 14 category filter pills"),
    ("09_Explore_FAQs_Filtered_Category.png", ["explore_filtered_fees_*.png"], "Category-filtered FAQ accordion cards with helpfulness rating counters"),
    # College Information Center
    ("10_Courses_and_Programs_Directory.png", ["courses_programs_page_*.png"], "Curriculum specifications for UG, PG, and Ph.D. programs with intake & duration"),
    ("11_Admissions_and_Eligibility.png", ["admissions_page_*.png"], "5-stage admission timeline, entrance exam cutoff percentiles, and required documents"),
    ("12_Fees_and_Payment_Structure.png", ["fees_scholarships_page_*.png"], "Tuition fee schedules, hostel tiers, payment channels, and installment options"),
    ("13_Scholarships_and_Financial_Aid.png", ["scholarships_page_*.png"], "Merit waivers (100%/50%), sports fellowships, and EWS financial assistance"),
    ("14_Campus_Facilities_and_Labs.png", ["campus_facilities_page_*.png"], "Central Library (24/7), NVIDIA GPU supercomputing cluster, and sports complex"),
    ("15_Hostel_and_Transportation.png", ["hostel_query_answered_*.png", "hostel_response_loaded_*.png"], "Hostel room tiers, dining timings, curfews, and 25-route campus bus network"),
    ("16_Placements_and_Career_Support.png", ["placements_careers_page_*.png"], "Placement records (₹44 LPA highest, 94.6% placed), recruiter bands, and DSA bootcamps"),
    # Conversation History & Saved
    ("17_Conversation_History_Management.png", ["conversation_history_page_*.png"], "Auto-saved threads grouped by Today/Yesterday/Older with search, pin, export"),
    ("18_Saved_Answers_Personal_Notebook.png", ["saved_answers_page_*.png"], "Personal notebook with custom collection folders, notes editor, and export"),
    # Learning Tools & Checklists
    ("19_Learning_Tools_and_Quizzes_Hub.png", ["learning_tools_page_*.png"], "AI Policy Summarizer, Interactive FAQ Quizzes, and Guided Checklists hub"),
    ("20_Guided_Checklist_Interactive_State.png", ["checklist_item_checked_*.png", "checklists_tab_content_*.png"], "Step-by-step application preparation checklist with interactive checkmarks"),
    ("21_Guided_Checklist_Completed_State.png", ["checklist_completed_state_*.png"], "Completed checklist with persistent localStorage state and progress ring"),
    # Feedback & Directory
    ("22_Feedback_and_Campus_Directory.png", ["feedback_directory_page_*.png"], "5-star feedback submission form and direct campus department phone/email directory"),
    # Settings & Verification
    ("23_Settings_Preferences_Dark_Mode.png", ["settings_page_*.png"], "Appearance themes, Groq/Grok API key setup, response style, and privacy controls"),
    ("24_Settings_Groq_Live_Connection_Test.png", ["groq_test_success_*.png"], "Live connection test verifying Groq Cloud (openai/gpt-oss-120b) in 949ms"),
    ("25_Settings_Light_Theme_View.png", ["settings_light_theme_*.png"], "Crisp light theme interface demonstrating persistent theme switching"),
    # Protected Administration Portal
    ("26_Admin_Portal_Dashboard.png", ["admin_logged_in_*.png"], "Protected administration overview with operational KPIs and system metrics"),
    ("27_Admin_FAQ_CRUD_Management.png", ["admin_faqs_page_*.png"], "FAQ management table, active toggles, CSV bulk export, and CSV bulk import"),
    ("28_Admin_Unanswered_Review_Queue.png", ["admin_unanswered_page_*.png"], "Review queue for low-confidence enquiries with 1-click 'Convert to FAQ' dialog"),
    ("29_Admin_Operational_Analytics.png", ["admin_analytics_page_*.png"], "Operational enquiry volume trends, resolution rates, and 7/30/90-day date filters"),
    ("30_Admin_User_Accounts_Directory.png", ["admin_users_page_*.png"], "Registered student & admin user directory with role badges and activity metrics"),
]

copied_count = 0
readme_lines = [
    "# CampusIQ — Complete Feature Screenshots Showcase",
    "",
    "This directory contains high-resolution screenshots capturing every feature and sub-module of the **CampusIQ AI-Powered College Enquiry Platform**.",
    "",
    "| # | File Name | Route | Feature Description |",
    "| :--- | :--- | :--- | :--- |",
]

for idx, (dest_name, patterns, desc) in enumerate(FEATURE_MAP, start=1):
    dest_path = os.path.join(DEST_DIR, dest_name)
    found_file = None

    for pattern in patterns:
        matched = glob.glob(os.path.join(SOURCE_DIR, pattern))
        if matched:
            # Pick latest if multiple
            matched.sort(key=os.path.getmtime, reverse=True)
            found_file = matched[0]
            break

    if found_file:
        shutil.copy2(found_file, dest_path)
        copied_count += 1
        file_size_kb = round(os.path.getsize(dest_path) / 1024)
        readme_lines.append(f"| {idx:02d} | [`{dest_name}`](./{dest_name}) | `{dest_name.split('_')[1]}` | {desc} ({file_size_kb} KB) |")
        print(f"[{idx:02d}] Copied: {dest_name} ({file_size_kb} KB)")
    else:
        print(f"[{idx:02d}] WARNING: Could not find match for patterns {patterns}")

# Write README.md
readme_path = os.path.join(DEST_DIR, "README.md")
with open(readme_path, "w", encoding="utf-8") as f:
    f.write("\n".join(readme_lines) + "\n")

print(f"\nSuccessfully populated screenshots folder: {DEST_DIR}")
print(f"Total screenshots copied: {copied_count} of {len(FEATURE_MAP)}")
print(f"Catalog documentation written to: {readme_path}")
