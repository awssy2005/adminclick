<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CinController extends Controller
{
public function verifyCin($cin)
{
    // Simulation de validation : format lettre(s) + 5 ou 6 chiffres
    if (preg_match('/^[A-Z]{1,2}\d{5,6}$/', strtoupper($cin))) {
        return response()->json(['valid' => true, 'message' => 'CIN valide']);
    }
    return response()->json(['valid' => false, 'message' => 'Format de CIN invalide'], 422);
}
}