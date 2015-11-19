describe('altAlertaFlutuanteDirective', function() {
  var _rootScope, _scope, _compile, _element, _AltAlertaFlutuanteEventos, _AltAlertaFlutuanteService;
  var EVENTO = "alt.exibe-alerta-flutuante";
  var EVENTO_ESCONDER = "alt.esconde-alerta-flutuante";
  var TROCA_ROTA = "$locationChangeSuccess";

  beforeEach(module('alt.alerta-flutuante'));

  beforeEach(inject(function($injector) {
      _rootScope = $injector.get('$rootScope');
      _scope = _rootScope.$new();
      _compile = $injector.get('$compile');
      _AltAlertaFlutuanteEventos = $injector.get('AltAlertaFlutuanteEventos');
      _AltAlertaFlutuanteService = $injector.get('AltAlertaFlutuanteService');

      var _html = '<div alt-alerta-flutuante></div>';

      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();

      spyOn(_rootScope, '$broadcast').and.callThrough();
    }));

  describe('service', function() {
    it('deve ter o service como um objeto', function() {
        expect(typeof _AltAlertaFlutuanteService).toBe('object');
    });

    it('exibe - deve chamar o $rootScope.$broadcast com os parâmetros corretos', function() {
        var _opcoes = {a: true};
        _AltAlertaFlutuanteService.exibe(_opcoes);

        expect(_rootScope.$broadcast).toHaveBeenCalledWith('alt.exibe-alerta-flutuante', _opcoes);
    });

    it('esconde - deve chamar o $rootScope.$broadcast com os parâmetros corretos', function() {
        var _opcoes = {a: true};
        _AltAlertaFlutuanteService.esconde(_opcoes);

        expect(_rootScope.$broadcast).toHaveBeenCalledWith('alt.esconde-alerta-flutuante', _opcoes);
    });
  });

  describe('diretiva', function() {

    describe('criação', function() {
      it('deve ter element criado e acessível', function() {
        expect(_element).toBeDefined();
      })

      it('deve ter o element invisível', function() {
        expect(_element.attr('style').match('none')).toBeTruthy();
      })

      it('deve ter os valores corretos para as constantes', function() {
        expect(_AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE).toEqual('alt.exibe-alerta-flutuante');
        expect(_AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE).toEqual('alt.esconde-alerta-flutuante');
        expect(_AltAlertaFlutuanteEventos.TROCA_ROTA).toEqual('$locationChangeSuccess');
      })
    })

    describe('reação ao click', function() {
      it('deve sumir com o alerta', function() {
        spyOn($.fn, 'stop').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        var _alerta = _element;
        var _close = _element.find('.close');

        _close.click();

        expect(_alerta.stop).toHaveBeenCalled();
        expect(_alerta.fadeOut).toHaveBeenCalledWith(99);
      })
    })

    describe('reação ao $broadcast - exibir alerta', function() {
      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - block', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'delay').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _element = _element.attr('style', 'display: block');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.delay).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();

      })

      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - opacity', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'delay').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _element = _element.attr('style', 'opacity: .94545454');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.delay).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();

      })

      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - block e opacity', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'delay').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _element = _element.attr('style', 'display: block; opacity: .94545454;');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.delay).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();
      })

      it('deve preencher o escopo com as propriedades default - tipo e mensagem', function() {
        _rootScope.$broadcast(EVENTO);

        expect(_element.isolateScope().tipo).toEqual("danger");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o escopo com o tipo default', function() {
        _rootScope.$broadcast(EVENTO, {msg: 'ae'});

        expect(_element.isolateScope().tipo).toEqual("danger");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("ae");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o escopo com a mensagem default', function() {
        _rootScope.$broadcast(EVENTO, {tipo: 'success'});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o titulo corretamente', function() {
        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1"});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o icone corretamente', function() {
        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1", icone: 'check'});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
      })
    })

    describe('reação ao $broadcast - esconder alerta', function() {
      it('deve sumir com o alerta', function() {
        spyOn($.fn, 'stop').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        var _alerta = _element;

        _rootScope.$broadcast(EVENTO_ESCONDER);

        expect(_alerta.stop).toHaveBeenCalled();
        expect(_alerta.fadeOut).toHaveBeenCalledWith(99);
      })
    })

    describe('reação ao $broadcast - esconder alerta - troca rota', function() {
      it('deve sumir com o alerta', function() {
        spyOn($.fn, 'stop').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        var _alerta = _element;

        _rootScope.$broadcast(TROCA_ROTA);

        expect(_alerta.stop).toHaveBeenCalled();
        expect(_alerta.fadeOut).toHaveBeenCalledWith(99);
      })
    })
  })
});
