#!/usr/bin/env python3
"""
Extract slide content from PowerPoint files for AI training
"""

import json
import sys
import os
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.enum.shapes import MSO_SHAPE_TYPE
except ImportError:
    print("Please install python-pptx: pip install python-pptx")
    sys.exit(1)

def extract_text_from_shape(shape):
    """Extract text from a shape if it has text."""
    if hasattr(shape, "text"):
        return shape.text.strip()
    return ""

def extract_slide_content(slide, slide_number):
    """Extract content from a single slide."""
    slide_data = {
        "id": f"template-{slide_number}",
        "slide_number": slide_number,
        "title": "",
        "content": "",
        "bullet_points": [],
        "has_image": False,
        "has_chart": False,
        "has_table": False,
        "layout_name": slide.slide_layout.name if hasattr(slide.slide_layout, 'name') else "Unknown",
        "text_content": [],
        "shape_count": len(slide.shapes)
    }
    
    # Extract text from all shapes
    for shape in slide.shapes:
        if shape.has_text_frame:
            text = extract_text_from_shape(shape)
            if text:
                slide_data["text_content"].append(text)
                
                # Try to identify title (usually first or largest text)
                if not slide_data["title"] and len(text) < 100:
                    slide_data["title"] = text
                elif not slide_data["content"]:
                    slide_data["content"] = text
                else:
                    slide_data["bullet_points"].append(text)
        
        # Check for images
        if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
            slide_data["has_image"] = True
        elif shape.shape_type == MSO_SHAPE_TYPE.CHART:
            slide_data["has_chart"] = True
        elif shape.shape_type == MSO_SHAPE_TYPE.TABLE:
            slide_data["has_table"] = True
    
    # Fallback: if no title found, use first text content
    if not slide_data["title"] and slide_data["text_content"]:
        slide_data["title"] = slide_data["text_content"][0][:50] + "..." if len(slide_data["text_content"][0]) > 50 else slide_data["text_content"][0]
    
    # Combine all text as content if no specific content found
    if not slide_data["content"] and len(slide_data["text_content"]) > 1:
        slide_data["content"] = " ".join(slide_data["text_content"][1:])
    
    return slide_data

def extract_powerpoint_slides(pptx_path, output_path):
    """Extract all slides from PowerPoint file."""
    try:
        presentation = Presentation(pptx_path)
        slides_data = []
        
        print(f"Processing {len(presentation.slides)} slides from {pptx_path}")
        
        for i, slide in enumerate(presentation.slides, 1):
            slide_data = extract_slide_content(slide, i)
            
            # Only include slides with actual content
            if slide_data["title"] or slide_data["content"] or slide_data["text_content"]:
                slides_data.append(slide_data)
                print(f"Extracted slide {i}: {slide_data['title'][:30]}...")
        
        # Save to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                "source_file": os.path.basename(pptx_path),
                "total_slides": len(slides_data),
                "extraction_date": str(Path(pptx_path).stat().st_mtime),
                "slides": slides_data
            }, f, indent=2, ensure_ascii=False)
        
        print(f"Extracted {len(slides_data)} slides to {output_path}")
        return slides_data
        
    except Exception as e:
        print(f"Error processing {pptx_path}: {e}")
        return []

def main():
    if len(sys.argv) != 3:
        print("Usage: python extract_pptx.py <input.pptx> <output.json>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found")
        sys.exit(1)
    
    extract_powerpoint_slides(input_file, output_file)

if __name__ == "__main__":
    main()