#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
胡桃主题海报生成器
生成一张胡桃主题的收藏版史诗叙事海报
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import math
import random
import os

# 设置颜色方案
COLORS = {
    'paper': '#F8F6F0',
    'crimson': '#8B2323',
    'amber': '#C4A35A',
    'gold': '#D4AF37',
    'sepia': '#704214',
    'ink': '#1A1A1A',
    'blood_red': '#A52A2A',
    'deep_crimson': '#6B1C1C',
    'light_paper': '#FAF6F0',
    'dark_paper': '#E8DFD0'
}

def create_gradient_background(width, height):
    """创建渐变背景"""
    bg = Image.new('RGB', (width, height), COLORS['paper'])
    draw = ImageDraw.Draw(bg)
    
    # 添加水彩效果
    for i in range(20):
        x = random.randint(0, width)
        y = random.randint(0, height)
        radius = random.randint(100, 400)
        color = random.choice([(139, 35, 35, 20), (196, 163, 90, 15), (112, 66, 20, 18)])
        alpha = color[3]
        for j in range(10):
            current_radius = int(radius * (1 - j * 0.08))
            if current_radius > 0:
                for k in range(50):
                    dx = random.randint(-current_radius, current_radius)
                    dy = random.randint(-current_radius, current_radius)
                    if dx*dx + dy*dy < current_radius*current_radius:
                        if 0 <= x+dx < width and 0 <= y+dy < height:
                            px = bg.getpixel((x+dx, y+dy))
                            new_r = int(px[0] * (1 - alpha/255) + color[0] * (alpha/255))
                            new_g = int(px[1] * (1 - alpha/255) + color[1] * (alpha/255))
                            new_b = int(px[2] * (1 - alpha/255) + color[2] * (alpha/255))
                            bg.putpixel((x+dx, y+dy), (new_r, new_g, new_b))
    
    return bg

def create_silhouette_mask(width, height):
    """创建胡桃侧脸剪影遮罩"""
    mask = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(mask)
    
    # 创建一个优雅的侧脸剪影轮廓
    center_x = width // 2
    center_y = height // 2
    
    # 使用贝塞尔曲线绘制剪影
    points = []
    # 额头
    points.append((center_x - 80, center_y - 200))
    points.append((center_x - 60, center_y - 230))
    points.append((center_x - 30, center_y - 245))
    points.append((center_x, center_y - 250))
    points.append((center_x + 30, center_y - 240))
    points.append((center_x + 60, center_y - 220))
    points.append((center_x + 80, center_y - 190))
    
    # 鼻子和脸颊
    points.append((center_x + 90, center_y - 140))
    points.append((center_x + 95, center_y - 110))
    points.append((center_x + 85, center_y - 80))
    points.append((center_x + 75, center_y - 60))
    
    # 下巴
    points.append((center_x + 65, center_y - 30))
    points.append((center_x + 55, center_y + 10))
    points.append((center_x + 40, center_y + 45))
    points.append((center_x + 20, center_y + 70))
    
    # 下巴到脖子
    points.append((center_x, center_y + 85))
    points.append((center_x - 20, center_y + 90))
    points.append((center_x - 45, center_y + 80))
    
    # 脖子和肩膀
    points.append((center_x - 65, center_y + 60))
    points.append((center_x - 85, center_y + 30))
    points.append((center_x - 100, center_y - 10))
    points.append((center_x - 105, center_y - 50))
    points.append((center_x - 100, center_y - 90))
    points.append((center_x - 90, center_y - 130))
    
    # 闭合
    points.append((center_x - 80, center_y - 200))
    
    # 绘制剪影
    draw.polygon(points, fill=255)
    
    # 应用轻微模糊
    mask = mask.filter(ImageFilter.GaussianBlur(1))
    
    return mask

def draw_blood_moon(draw, x, y, size):
    """绘制血月"""
    # 月亮
    draw.ellipse([x - size, y - size, x + size, y + size], fill=(139, 35, 35, 180))
    draw.ellipse([x - size + 5, y - size + 5, x + size - 5, y + size - 5], fill=(165, 42, 42, 200))
    
    # 月亮上的阴影
    draw.ellipse([x - 10, y - 15, x + 10, y + 15], fill=(26, 26, 26, 50))

def draw_wangsheng_temple(draw, x, y, width, height):
    """绘制往生堂楼阁"""
    # 楼阁主体
    building_color = (93, 46, 12, 200)
    
    # 下层
    draw.rectangle([x - width//2, y, x + width//2, y + height//2], fill=building_color)
    
    # 上层飞檐
    points = [
        (x - width//2 - 10, y),
        (x - width//4, y - height//4),
        (x, y - height//3),
        (x + width//4, y - height//4),
        (x + width//2 + 10, y)
    ]
    draw.polygon(points, fill=(74, 37, 10, 200))
    
    # 窗户/门
    draw.rectangle([x - 15, y + 15, x + 15, y + height//2], fill=(45, 23, 6, 220))
    
    # 灯光效果
    for i in range(3):
        lx = x + (i - 1) * 20
        ly = y + (i % 2) * 10
        draw.ellipse([lx - 3, ly - 3, lx + 3, ly + 3], fill=(212, 175, 55, 100))

def draw_spider_lilies(draw, x, y, count):
    """绘制彼岸花"""
    for i in range(count):
        offset_x = x + (i - count//2) * 40
        offset_y = y + random.randint(-10, 10)
        
        # 花瓣
        petal_color = (139, 35, 35, random.randint(150, 200))
        for j in range(6):
            angle = (j * 60 + random.randint(-10, 10)) * math.pi / 180
            petal_length = 15 + random.randint(0, 10)
            petal_width = 5 + random.randint(0, 5)
            
            px = offset_x + math.cos(angle) * petal_length
            py = offset_y + math.sin(angle) * petal_length
            
            draw.ellipse([px - petal_width, py - petal_width, px + petal_width, py + petal_width], fill=petal_color)
        
        # 花心
        draw.ellipse([offset_x - 3, offset_y - 3, offset_x + 3, offset_y + 3], fill=(107, 28, 28, 180))

def draw_butterfly(draw, x, y, size=20, rotation=0):
    """绘制蝴蝶"""
    # 翅膀
    wing_color = (196, 163, 90, 180)
    wing_color2 = (139, 105, 20, 150)
    
    # 左翅膀
    draw.ellipse([x - size, y - size, x, y], fill=wing_color)
    draw.ellipse([x - size*0.6, y, x, y + size*0.6], fill=wing_color2)
    
    # 右翅膀
    draw.ellipse([x, y - size, x + size, y], fill=wing_color)
    draw.ellipse([x, y, x + size*0.6, y + size*0.6], fill=wing_color2)
    
    # 身体
    draw.ellipse([x - 2, y - size*0.7, x + 2, y + size*0.3], fill=(45, 31, 21, 200))

def draw_lantern(draw, x, y, size=15):
    """绘制灯笼"""
    # 灯笼主体
    draw.ellipse([x - size, y - size*1.2, x + size, y + size*1.2], fill=(139, 35, 35, 160))
    draw.ellipse([x - size*0.8, y - size, x + size*0.8, y + size], fill=(255, 215, 0, 100))
    
    # 灯笼绳
    draw.rectangle([x - 1, y - size*1.2 - 10, x + 1, y - size*1.2], fill=(93, 78, 55, 180))

def draw_ghost(draw, x, y, size=35):
    """绘制幽灵"""
    # 身体
    draw.ellipse([x - size, y - size, x + size, y + size*1.3], fill=(255, 255, 255, 150))
    draw.ellipse([x - size*0.9, y - size*0.9, x + size*0.9, y + size*1.1], fill=(240, 230, 214, 100))
    
    # 眼睛
    draw.ellipse([x - size*0.3, y - size*0.2, x - size*0.15, y], fill=(107, 107, 107, 200))
    draw.ellipse([x + size*0.15, y - size*0.2, x + size*0.3, y], fill=(107, 107, 107, 200))
    
    # 嘴巴
    draw.arc([x - size*0.2, y + size*0.1, x + size*0.2, y + size*0.3], 0, 180, fill=(107, 107, 107, 180), width=2)
    
    # 小手臂
    draw.line([x - size*0.5, y + size*0.2, x - size*0.6, y - size*0.1], fill=(196, 163, 90, 120), width=2)
    draw.line([x + size*0.5, y + size*0.2, x + size*0.6, y - size*0.1], fill=(196, 163, 90, 120), width=2)

def draw_hutao_figure(draw, x, y, scale=1.0):
    """绘制胡桃人物剪影"""
    # 头
    head_radius = int(15 * scale)
    draw.ellipse([x - head_radius, y - 50*scale - head_radius, x + head_radius, y - 50*scale + head_radius], fill=(61, 40, 23, 200))
    
    # 身体 - 衣服
    body_color = (139, 35, 35, 200)
    draw.polygon([
        (x - 12*scale, y - 35*scale),
        (x, y - 45*scale),
        (x + 12*scale, y - 35*scale),
        (x + 18*scale, y - 10*scale),
        (x, y - 5*scale),
        (x - 18*scale, y - 10*scale)
    ], fill=body_color)
    
    # 下半身
    draw.polygon([
        (x - 15*scale, y - 5*scale),
        (x, y),
        (x + 15*scale, y - 5*scale),
        (x + 22*scale, y + 35*scale),
        (x, y + 40*scale),
        (x - 22*scale, y + 35*scale)
    ], fill=body_color)
    
    # 腿
    draw.line([(x - 18*scale, y + 35*scale), (x - 22*scale, y + 80*scale)], fill=(26, 26, 26, 200), width=int(3*scale))
    draw.line([(x + 18*scale, y + 35*scale), (x + 22*scale, y + 80*scale)], fill=(26, 26, 26, 200), width=int(3*scale))
    
    # 鞋子
    draw.ellipse([x - 26*scale, y + 78*scale, x - 18*scale, y + 86*scale], fill=(45, 32, 32, 200))
    draw.ellipse([x + 18*scale, y + 78*scale, x + 26*scale, y + 86*scale], fill=(45, 32, 32, 200))

def draw_gravestone(draw, x, y, width, height):
    """绘制墓碑"""
    # 碑身
    stone_color = (107, 107, 107, 180)
    draw.rectangle([x - width//2, y, x + width//2, y + height], fill=stone_color)
    draw.rectangle([x - width//2 + 3, y + 5, x + width//2 - 3, y + height - 5], fill=(61, 61, 61, 150))
    
    # 碑顶
    draw.polygon([(x - width//2 - 5, y), (x, y - 15), (x + width//2 + 5, y)], fill=(107, 107, 107, 180))

def add_text_elements(image):
    """添加文字元素"""
    draw = ImageDraw.Draw(image)
    width, height = image.size
    
    try:
        # 尝试加载中文字体
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc", 80)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc", 24)
        font_poem = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc", 18)
        font_english = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc", 16)
    except:
        # 如果没有中文字体，使用默认字体
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_poem = ImageFont.load_default()
        font_english = ImageFont.load_default()
    
    # 左侧竖排标题 - 往生堂
    title_text = "往生堂"
    title_y = 100
    for i, char in enumerate(title_text):
        text_color = (139, 35, 35, 255)
        draw.text((80, title_y + i * 90), char, font=font_title, fill=text_color)
    
    # 副标题 - 七十五代堂主
    subtitle_text = "七十五代堂主"
    for i, char in enumerate(subtitle_text):
        text_color = (112, 66, 20, 220)
        draw.text((100, 400 + i * 40), char, font=font_subtitle, fill=text_color)
    
    # 右侧竖排诗句
    poem_text1 = "生人未必能记住死者"
    poem_text2 = "但死人一定会记得生人"
    
    poem_x = width - 80
    poem_y1 = 250
    for i, char in enumerate(poem_text1):
        text_color = (107, 28, 28, 180)
        draw.text((poem_x, poem_y1 + i * 35), char, font=font_poem, fill=text_color)
    
    poem_y2 = 250 + len(poem_text1) * 35 + 40
    for i, char in enumerate(poem_text2):
        text_color = (107, 28, 28, 180)
        draw.text((poem_x, poem_y2 + i * 35), char, font=font_poem, fill=text_color)
    
    # 左下角英文
    draw.text((80, height - 120), "HU TAO", font=font_english, fill=(139, 35, 35, 200))
    draw.text((80, height - 90), "LIYUE WANGSHENG", font=font_english, fill=(139, 105, 20, 160))
    draw.text((80, height - 65), "FUNERAL PARLOR", font=font_english, fill=(139, 105, 20, 160))
    
    # 绘制印章
    draw_seal(draw, 130, 580, 50, "胡桃")
    draw_seal(draw, width - 70, height - 70, 35, "胡")

def draw_seal(draw, x, y, size, text):
    """绘制印章"""
    # 印章背景
    draw.rectangle([x, y, x + size, y + size], fill=(139, 35, 35, 200))
    draw.rectangle([x + 3, y + 3, x + size - 3, y + size - 3], fill=(139, 35, 35, 230))
    
    # 印章边框
    draw.rectangle([x, y, x + size, y + size], outline=(107, 28, 28, 200), width=2)
    
    try:
        font_seal = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc", int(size * 0.6))
    except:
        font_seal = ImageFont.load_default()
    
    # 印章文字（简化处理）
    text_color = (248, 246, 240, 220)
    if len(text) == 2:
        draw.text((x + size//4, y + size//4), text[0], font=font_seal, fill=text_color)
        draw.text((x + size//4, y + size//2), text[1], font=font_seal, fill=text_color)
    else:
        draw.text((x + size//4, y + size//4), text, font=font_seal, fill=text_color)

def add_paper_texture(image):
    """添加纸张纹理"""
    width, height = image.size
    texture = Image.new('RGB', (width, height), (248, 246, 240))
    draw = ImageDraw.Draw(texture)
    
    # 添加噪点纹理
    for i in range(width * height // 50):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        gray = random.randint(240, 255)
        texture.putpixel((x, y), (gray, gray, gray))
    
    # 混合纹理
    result = Image.blend(image, texture, 0.05)
    
    # 添加晕影效果
    vignette = Image.new('L', (width, height), 0)
    draw_vignette = ImageDraw.Draw(vignette)
    
    for y in range(height):
        for x in range(width):
            dx = x - width / 2
            dy = y - height / 2
            distance = math.sqrt(dx*dx + dy*dy)
            max_distance = math.sqrt((width/2)*(width/2) + (height/2)*(height/2))
            intensity = int((distance / max_distance) * 60)
            vignette.putpixel((x, y), min(intensity, 60))
    
    # 应用晕影
    result.putalpha(255)
    result.paste((0, 0, 0), mask=vignette)
    
    return result

def add_embers(image):
    """添加余烬效果"""
    width, height = image.size
    result = image.copy()
    draw = ImageDraw.Draw(result)
    
    for i in range(80):
        x = random.randint(width // 4, width * 3 // 4)
        y = random.randint(height // 2, height)
        size = random.randint(2, 5)
        opacity = random.randint(50, 150)
        
        # 随机暖色调
        colors = [(255, 215, 0, opacity), (212, 175, 55, opacity), (196, 163, 90, opacity)]
        color = random.choice(colors)
        
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color[:3] + (opacity,))
    
    return result

def add_cherry_blossoms(image):
    """添加樱花花瓣"""
    width, height = image.size
    result = image.copy()
    draw = ImageDraw.Draw(result)
    
    for i in range(25):
        x = random.randint(width * 2 // 3, width - 50)
        y = random.randint(50, height // 2)
        size = random.randint(3, 6)
        opacity = random.randint(80, 150)
        
        color = (255, 183, 197, opacity)
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color[:3] + (opacity,))
    
    return result

def create_postcard():
    """创建海报"""
    # 设置海报尺寸
    width = 800
    height = 1200
    
    print("创建背景...")
    background = create_gradient_background(width, height)
    
    print("创建场景元素...")
    # 在背景上绘制剪影内部的场景
    scene_image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    scene_draw = ImageDraw.Draw(scene_image)
    
    center_x = width // 2
    center_y = height // 2
    
    # 绘制血月
    draw_blood_moon(scene_draw, center_x + 100, 200, 60)
    
    # 绘制往生堂
    draw_wangsheng_temple(scene_draw, center_x + 80, 350, 150, 120)
    
    # 绘制幽灵
    draw_ghost(scene_draw, center_x + 180, 450, 30)
    
    # 绘制胡桃人物
    draw_hutao_figure(scene_draw, center_x, 480, scale=1.0)
    
    # 绘制蝴蝶
    draw_butterfly(scene_draw, center_x - 80, 280, size=15)
    
    # 绘制灯笼
    draw_lantern(scene_draw, center_x - 100, 220, size=12)
    draw_lantern(scene_draw, center_x - 40, 200, size=10)
    draw_lantern(scene_draw, center_x + 30, 210, size=11)
    draw_lantern(scene_draw, center_x + 100, 190, size=9)
    
    # 绘制彼岸花
    draw_spider_lilies(scene_draw, center_x, 800, 8)
    
    # 绘制墓碑
    draw_gravestone(scene_draw, center_x - 60, 820, 30, 60)
    
    # 添加角色关系剪影（简化版）
    scene_draw.ellipse([center_x - 20, 900, center_x - 5, 915], fill=(45, 32, 32, 150))
    scene_draw.ellipse([center_x + 5, 900, center_x + 20, 915], fill=(45, 32, 32, 150))
    
    # 创建剪影遮罩
    print("创建剪影...")
    silhouette_mask = create_silhouette_mask(width, height)
    
    # 将场景应用到剪影上
    scene_image_black = Image.new('RGBA', (width, height), (26, 26, 26, 255))
    
    # 混合：背景 + 剪影内的场景 + 黑色剪影轮廓
    result = background.copy()
    result = result.convert('RGBA')
    
    # 先将场景通过遮罩应用
    scene_rgb = scene_image.convert('RGB')
    result.paste(scene_rgb, mask=silhouette_mask)
    
    # 添加黑色轮廓
    black_silhouette = Image.new('RGBA', (width, height), (26, 26, 26, 0))
    draw_black = ImageDraw.Draw(black_silhouette)
    black_silhouette.paste((26, 26, 26, 100), mask=silhouette_mask.filter(ImageFilter.MaxFilter(3)))
    result = Image.alpha_composite(result, black_silhouette)
    
    # 稍微描边
    black_silhouette2 = Image.new('RGBA', (width, height), (26, 26, 26, 0))
    draw_black2 = ImageDraw.Draw(black_silhouette2)
    black_silhouette2.paste((26, 26, 26, 200), mask=silhouette_mask.filter(ImageFilter.FIND_EDGES))
    result = Image.alpha_composite(result, black_silhouette2)
    
    # 添加文字
    print("添加文字...")
    result_rgb = result.convert('RGB')
    add_text_elements(result_rgb)
    
    # 添加效果
    print("添加纹理效果...")
    final = add_paper_texture(result_rgb)
    final = add_embers(final)
    final = add_cherry_blossoms(final)
    
    return final

if __name__ == "__main__":
    print("开始生成胡桃主题海报...")
    poster = create_postcard()
    
    # 保存图片
    output_path = "/workspace/hutao-epic-poster/hutao_poster.png"
    poster.save(output_path, "PNG", quality=95)
    print(f"海报已保存到: {output_path}")
    
    # 也保存一份JPG版本
    output_path_jpg = "/workspace/hutao-epic-poster/hutao_poster.jpg"
    poster.save(output_path_jpg, "JPEG", quality=95)
    print(f"海报(JPG)已保存到: {output_path_jpg}")
    
    print("海报生成完成!")
