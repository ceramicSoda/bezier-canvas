import bpy
import json
from bpy_extras.io_utils import ExportHelper

class ExportBezierCurves(bpy.types.Operator, ExportHelper):
    bl_idname = "export.bezier_curves"
    bl_label = "Export Bezier Curves"
    filename_ext = ".json"

    def execute(self, context):
        bezier_curves = []
        for obj in bpy.context.scene.objects:
            if obj.type == 'CURVE' and obj.data.splines[0].type == 'BEZIER':
                for spline in obj.data.splines:
                    for point in spline.bezier_points:
                        bezier_curves.append([
                            [round(item * 100) for item in point.co],
                            [round(item * 100) for item in point.handle_left],
                            [round(item * 100) for item in point.handle_right]
                        ])
        output_path = bpy.path.ensure_ext(self.filepath, self.filename_ext)
        with open(output_path, 'w') as json_file:
            json.dump(bezier_curves, json_file, separators=(',', ':'))

        return {'FINISHED'}

def menu_func_export(self, context):
    self.layout.operator(ExportBezierCurves.bl_idname, text="Bezier to JSON")

def register():
    bpy.utils.register_class(ExportBezierCurves)
    bpy.types.TOPBAR_MT_file_export.append(menu_func_export)

def unregister():
    bpy.utils.unregister_class(ExportBezierCurves)
    bpy.types.TOPBAR_MT_file_export.remove(menu_func_export)

if __name__ == "__main__":
    register()