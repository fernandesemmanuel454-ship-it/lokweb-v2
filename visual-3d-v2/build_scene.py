"""Editable Blender scene for the LokWeb restaurant website hero concept."""

from pathlib import Path
import math

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parent
PHOTO = ROOT / "assets" / "pizzaiolo-source.png"
PHOTO_CROP = ROOT / "assets" / "pizzaiolo-portrait.png"
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1440
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 120
scene.world.color = (0.004, 0.009, 0.020)
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"


def collection(name):
    found = bpy.data.collections.get(name)
    if found is None:
        found = bpy.data.collections.new(name)
        scene.collection.children.link(found)
    return found


def put(obj, group):
    target = collection(group)
    for original in tuple(obj.users_collection):
        original.objects.unlink(obj)
    target.objects.link(obj)
    return obj


def material(name, color, roughness=0.55, metallic=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    shader = m.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    return m


navy = material("LokWeb midnight", (0.007, 0.015, 0.036))
navy_card = material("Deep blue card", (0.014, 0.033, 0.077), 0.42)
blue = material("LokWeb cobalt", (0.035, 0.18, 1.0), 0.32)
electric = material("Path blue", (0.13, 0.37, 1.0), 0.25)
white = material("Website white", (0.98, 0.98, 0.96), 0.48)
offwhite = material("Warm page", (0.94, 0.95, 0.94), 0.55)
ink = material("Interface ink", (0.023, 0.036, 0.075), 0.65)
muted = material("Secondary text", (0.37, 0.42, 0.48), 0.6)
red = material("Pizza tomato accent", (0.68, 0.13, 0.10), 0.5)


def image_material(name, path):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Strength"].default_value = 1.0
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = bpy.data.images.load(str(path), check_existing=True)
    texture.interpolation = "Linear"
    m.node_tree.links.new(texture.outputs["Color"], emission.inputs["Color"])
    m.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])
    return m


photo_full = image_material("Restaurant source photograph", PHOTO)
photo_portrait = image_material("Restaurant mobile crop", PHOTO_CROP)


def box(name, loc, dims, mat, radius=0.0, group="Scene"):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if radius:
        bevel = obj.modifiers.new("Soft edge", "BEVEL")
        bevel.width = radius
        bevel.segments = 4
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return put(obj, group)


def photo_plane(name, loc, width, height, mat, group="Scene"):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = (width, height, 1)
    obj.rotation_euler.x = math.pi / 2
    obj.data.materials.append(mat)
    return put(obj, group)


def text(name, body, loc, size, mat, bold=False, group="Scene"):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = body
    curve.size = size
    curve.extrude = 0.0008
    curve.font = bpy.data.fonts.load(FONT_BOLD if bold else FONT)
    obj = bpy.data.objects.new(name, curve)
    scene.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler.x = math.pi / 2
    obj.data.materials.append(mat)
    return put(obj, group)


def attach(parts, parent):
    for obj in parts:
        world = obj.matrix_world.copy()
        obj.parent = parent
        obj.matrix_world = world


def key_scale(obj, frame, scale):
    obj.scale = (scale, scale, scale)
    obj.keyframe_insert(data_path="scale", frame=frame)


def area(name, loc, energy, color, size, target):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = "DISK"
    data.size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()
    put(obj, "Lighting")


# Quiet studio background. The human photograph is the visual anchor.
box("Backdrop", (0, 1.55, 1.7), (13, 0.12, 7), navy, group="Environment")
box("Source card shadow", (-2.62, 0.10, 1.57), (3.58, 0.17, 2.65), navy_card, 0.09, "Restaurant photograph")
box("Source card frame", (-2.62, -0.03, 1.60), (3.55, 0.13, 2.60), white, 0.065, "Restaurant photograph")
source_photo = photo_plane("Pizzaiolo at work", (-2.62, -0.105, 1.60), 3.43, 2.46, photo_full, "Restaurant photograph")
box("Photo edge accent", (-4.35, -0.13, 1.60), (0.035, 0.035, 2.48), blue, 0.007, "Restaurant photograph")

# The web page appears as a refined site layout, without a retro window chrome.
browser_root = bpy.data.objects.new("Website assembly timeline", None)
scene.collection.objects.link(browser_root)
browser_root.location = (2.15, 0, 1.62)
put(browser_root, "Website layout")
browser_parts = []


def web_box(*args, **kwargs):
    obj = box(*args, group="Website layout", **kwargs)
    browser_parts.append(obj)
    return obj


def web_text(*args, **kwargs):
    obj = text(*args, group="Website layout", **kwargs)
    browser_parts.append(obj)
    return obj


web_box("Website shadow", (2.15, 0.08, 1.58), (4.48, 0.17, 3.06), navy_card, radius=0.08)
web_box("Website surface", (2.15, -0.045, 1.64), (4.42, 0.12, 3.03), white, radius=0.07)
web_box("Header divider", (2.15, -0.12, 2.82), (4.22, 0.02, 0.016), offwhite)
web_box("Brand mark", (0.34, -0.13, 2.96), (0.13, 0.025, 0.13), blue, radius=0.02)
web_text("Restaurant name", "PIZZERIA LOCALE", (0.49, -0.14, 2.90), 0.14, ink, True)
web_text("Menu link", "La carte", (3.04, -0.14, 2.90), 0.12, muted)
web_text("Contact link", "Contact", (3.84, -0.14, 2.90), 0.12, muted)
web_text("Restaurant eyebrow", "FAIT SUR PLACE", (0.37, -0.15, 2.42), 0.125, red, True)
web_text("Headline line 1", "La pizza,", (0.36, -0.15, 2.01), 0.36, ink, True)
web_text("Headline line 2", "faite avec soin.", (0.36, -0.15, 1.62), 0.36, ink, True)
web_text("Description", "Sur place et à emporter", (0.37, -0.15, 1.30), 0.16, muted)
web_box("Menu CTA", (1.16, -0.15, 0.96), (1.62, 0.05, 0.37), blue, radius=0.045)
web_text("Menu CTA wording", "Voir la carte", (0.61, -0.185, 0.88), 0.17, white, True)
web_box("Photo slot backing", (3.25, -0.14, 1.70), (1.73, 0.05, 2.19), navy_card, radius=0.04)
attach(browser_parts, browser_root)
key_scale(browser_root, 1, 0.001)
key_scale(browser_root, 29, 0.001)
key_scale(browser_root, 54, 1.0)
key_scale(browser_root, 120, 1.0)

# One actual content card travels from the restaurant photograph into the page.
moving_photo = photo_plane("Photo transferred into site", (3.25, -0.205, 1.70), 1.63, 2.07, photo_portrait, "Content transfer")
moving_photo.location = (-2.62, -0.30, 1.57)
moving_photo.scale = (0.0163, 0.0207, 1)
moving_photo.keyframe_insert(data_path="location", frame=1)
moving_photo.keyframe_insert(data_path="scale", frame=1)
moving_photo.keyframe_insert(data_path="location", frame=18)
moving_photo.keyframe_insert(data_path="scale", frame=18)
moving_photo.location = (-1.82, -0.42, 1.90)
moving_photo.scale = (1.793, 2.277, 1)
moving_photo.keyframe_insert(data_path="location", frame=32)
moving_photo.keyframe_insert(data_path="scale", frame=32)
moving_photo.location = (3.25, -0.205, 1.70)
moving_photo.scale = (1.63, 2.07, 1)
moving_photo.keyframe_insert(data_path="location", frame=66)
moving_photo.keyframe_insert(data_path="scale", frame=66)
moving_photo.keyframe_insert(data_path="location", frame=120)

# Draw and retract one continuous route under the moving content.
path_curve = bpy.data.curves.new("Content route", "CURVE")
path_curve.dimensions = "3D"
path_curve.resolution_u = 32
path_curve.bevel_depth = 0.018
path_curve.bevel_resolution = 3
spline = path_curve.splines.new("BEZIER")
spline.bezier_points.add(2)
for point, co in zip(spline.bezier_points, ((-1.30, -0.28, 0.55), (0.18, -0.31, 0.78), (1.70, -0.28, 0.55))):
    point.co = co
    point.handle_left_type = "AUTO"
    point.handle_right_type = "AUTO"
path_curve.materials.append(electric)
route = bpy.data.objects.new("One moving content path", path_curve)
scene.collection.objects.link(route)
put(route, "Content transfer")
for frame, start, end in ((1, 0, 0), (25, 0, 0), (58, 0, 1), (74, 1, 1)):
    path_curve.bevel_factor_start = start
    path_curve.bevel_factor_end = end
    path_curve.keyframe_insert(data_path="bevel_factor_start", frame=frame)
    path_curve.keyframe_insert(data_path="bevel_factor_end", frame=frame)

# The responsive version follows the desktop layout, as the last beat.
phone_root = bpy.data.objects.new("Mobile layout timeline", None)
scene.collection.objects.link(phone_root)
phone_root.location = (4.16, -0.62, 1.05)
put(phone_root, "Mobile layout")
phone_parts = []


def phone_box(*args, **kwargs):
    obj = box(*args, group="Mobile layout", **kwargs)
    phone_parts.append(obj)
    return obj


phone_box("Phone rim", (4.16, -0.62, 1.05), (0.87, 0.18, 1.80), ink, radius=0.11)
phone_box("Phone display", (4.16, -0.73, 1.05), (0.77, 0.028, 1.65), white, radius=0.07)
phone_parts.append(photo_plane("Pizza on mobile", (4.16, -0.755, 1.32), 0.66, 0.88, photo_portrait, "Mobile layout"))
phone_box("Phone heading", (4.09, -0.775, 0.74), (0.50, 0.017, 0.045), ink, radius=0.008)
phone_box("Phone subline", (4.02, -0.775, 0.63), (0.35, 0.017, 0.026), muted, radius=0.006)
phone_box("Phone contact CTA", (4.16, -0.775, 0.44), (0.55, 0.022, 0.16), blue, radius=0.022)
attach(phone_parts, phone_root)
key_scale(phone_root, 1, 0.001)
key_scale(phone_root, 72, 0.001)
key_scale(phone_root, 99, 1.0)
key_scale(phone_root, 120, 1.0)

area("Warm human light", (-4.2, -5.5, 5.0), 780, (1.0, 0.83, 0.69), 5.0, (-2.6, 0, 1.6))
area("Cool interface light", (4.2, -4.6, 5.6), 900, (0.73, 0.84, 1.0), 5.0, (2.2, 0, 1.6))
area("Blue edge light", (0.2, 2.0, 4.8), 630, (0.20, 0.42, 1.0), 4.0, (0, 0, 1.3))

bpy.ops.object.camera_add(location=(0.0, -12.8, 4.4))
camera = bpy.context.object
camera.name = "LokWeb hero camera"
camera.rotation_euler = (Vector((0.0, 0.0, 1.55)) - camera.location).to_track_quat("-Z", "Y").to_euler()
camera.data.type = "ORTHO"
camera.data.ortho_scale = 10.05
scene.camera = camera
put(camera, "Camera")

scene.frame_set(112)
scene.render.filepath = str(ROOT / "lokweb-pizzeria-site-v2.png")
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / "lokweb-pizzeria-site-v2.blend"))
bpy.ops.render.render(write_still=True)
