@if(isset($data))
    @php

        $game = explode('-', $data)[0];
        $demo = filter_var(explode('-', $data)[1], FILTER_VALIDATE_BOOLEAN);
        $game = \App\Games\Kernel\Game::find($game);
        if($game == null) {
            echo "404";
            return;
        }

        $supportedModules = [];
        foreach (\App\Games\Kernel\Module\Module::modules() as $module) {
            $instance = new $module($game, null, null, null);
            if($instance->supports()) array_push($supportedModules, $instance);
        }
    @endphp

    <div class="row page-title">
        <div class="col-md-12">
            <h4 class="mb-1 mt-1">{{ $game->metadata()->name() }} ({{ $demo ? 'demo' : 'real' }})</h4>
            <code>{{ $game->metadata()->id() }}/*{{ $game instanceof \App\Games\Kernel\Quick\QuickGame ? 'Quick' : 'Extended'}}</code>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-md-4">
                <div class="card">
                    <div class="card-body pt-2">
                        <h6 class="header-title mb-4">Supported modules</h6>
                        <div class="task-list-items">
                            @foreach($supportedModules as $module)
                                <div class="card border mb-0">
                                    <div class="card-body p-3">
                                        <h6 class="mt-0 mb-2 font-size-15 text-body">
                                            {!! $module->name() !!}
                                        </h6>
                                        <p class="text-muted mb-2 font-weight-light">
                                            {!! $module->description() !!}
                                        </p>
                                        <div class="custom-control custom-checkbox mt-3">
                                            <input @if(\App\Modules::get($game, $demo)->isEnabled($module)) checked @endif data-demo="{{ $demo ? 'true' : 'false' }}" data-toggle-module="{{ $module->id() }}" data-api-id="{{ $game->metadata()->id() }}" type="checkbox" class="custom-control-input" id="check-{{ $module->id() }}">
                                            <label class="custom-control-label font-weight-light" for="check-{{ $module->id() }}">
                                                Enable
                                            </label>
                                        </div>
                                        <p class="mb-0 mt-4">
                                            <span class="text-nowrap align-middle font-size-13">
                                                <i class="uil uil-cog mr-1 text-muted"></i> Available settings: {{ count($module->settings()) }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-8">
                <div class="card">
                    <div class="card-body pt-2">
                        <h6 class="header-title mb-4">Enabled modules</h6>
                        <div class="task-list-items">
                            @foreach(\App\Modules::get($game, $demo)->activeModules() as $module)
                                <div class="card border mb-0">
                                    <div class="card-body p-3">
                                        <h6 class="mt-0 mb-2 font-size-15 text-body">
                                            {!! $module->name() !!}
                                        </h6>
                                        <div class="mt-2">
                                            @foreach($module->settings() as $option)
                                                @if($option->type() === 'input')
                                                    <div class="mb-2">
                                                        <div class="font-size-15 font-weight-bold">{!! $option->name() !!}</div>
                                                        <div class="text-muted font-weight-light">{!! $option->description() !!}</div>
                                                        <input data-module-id="{{ $module->id() }}" data-demo="{{ $demo ? 'true' : 'false' }}" data-input-setting="{{ $option->id() }}" data-api-id="{{ $game->metadata()->id() }}" type="text" class="form-control mt-1" value="{{ \App\Modules::get($game, $demo)->get($module, $option->id()) }}" placeholder="{{ $option->defaultValue() }}">
                                                    </div>
                                                @else
                                                    Unknown option type "{{ $option->type() }}"
                                                @endif
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@else

    <div class="container-fluid mt-3">
        <div class="row">
            @foreach(\App\Games\Kernel\Game::list() as $game)
                @if($game->metadata()->isPlaceholder()) @continue @endif
                @php
                    $supportedModules = [];
                    foreach (\App\Games\Kernel\Module\Module::modules() as $module) {
                        $instance = new $module($game, null, null, null);
                        if($instance->supports()) array_push($supportedModules, $instance);
                    }
                @endphp

                <div class="col-6 col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-1">{{ $game->metadata()->name() }}</h5>
                            <h6 class="text-muted font-weight-normal mt-0 mb-3">{{ $game->metadata()->id() }}/{{ count($supportedModules) }}</h6>
                            <div class="card-text text-center btn-group">
                                <button type="button" class="btn btn-primary btn-sm" onclick="redirect('/admin/modules/{{ $game->metadata()->id() }}-false')">Real</button>
                                <button type="button" class="btn btn-danger btn-sm" onclick="redirect('/admin/modules/{{ $game->metadata()->id() }}-true')">Demo</button>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endif
