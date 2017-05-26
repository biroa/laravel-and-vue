<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Item;

/**
 * Class VueItemController
 * @package App\Http\Controllers
 */
class VueItemController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function manageVue(){
        return view('manage-vue');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request){
        $items= Item::latest()->paginate(5);

        $response = [
            'pagination' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'from' => $items->firstItem(),
                'to' => $items->lastItem()
            ],
            'data' => $items
        ];

        return response()->json($response);

    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request){
        $this->validate($request,[
            'title' => 'required',
            'description' => 'required',
        ]);

        $create = Item::create($request->all());
        return response()->json($create);
    }

    /**
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id){
        $this->validate($request,[
            'title'       =>    'required',
            'description' =>    'required'
        ]);

        $edit = Item::find($id)->update($request->all());

        return response()->json($edit);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id){
        Item::find($id)->delete();
        return response()->json(['done']);
    }
}
