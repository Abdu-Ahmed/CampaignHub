<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index() {
  return auth()->user()->dashboards;
}
public function store(Request $r)
{
    $data = $r->validate([
        'name'   => 'required|string',
        'config' => 'required|array',    // ← was 'required|json'
    ]);

    return auth()->user()
        ->dashboards()
        ->create($data);
}
public function update(Request $r, $id)
{
    $dash = auth()->user()->dashboards()->findOrFail($id);

    $data = $r->validate([
        'name'   => 'required|string',
        'config' => 'required|array',    // ← was 'required|json'
    ]);

    $dash->update($data);
    return $dash;
}
public function destroy($id){
  return auth()->user()->dashboards()->findOrFail($id)->delete();
}
}
