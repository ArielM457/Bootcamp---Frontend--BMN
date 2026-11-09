import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Welcome } from './welcome';

async function renderWelcome(): Promise<HTMLElement> {
  await TestBed.configureTestingModule({
    imports: [Welcome],
    providers: [provideRouter([])],
  }).compileComponents();

  const fixture = TestBed.createComponent(Welcome);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('Welcome HOME-01', () => {
  it('muestra el menú principal sin etiquetas de desarrollo', async () => {
    const root = await renderWelcome();
    const menu = root.querySelector('nav[aria-label="Menú de Bomberman Online"]');
    const links = menu?.querySelectorAll('a');

    expect(menu).toBeTruthy();
    expect(links).toHaveLength(4);
    expect(root.textContent).not.toContain('Base en desarrollo · Fase 0');
    expect(root.textContent).not.toContain('Simulación visual');
    expect(root.textContent).not.toContain('CodeSprint');
    expect(root.textContent).not.toContain('Escena animada de presentación');
    expect(root.textContent).toContain('Buscar sala');
    expect(root.querySelector('header')).toBeNull();
  });

  it('mantiene las rutas de cada opción del menú', async () => {
    const root = await renderWelcome();
    const hrefs = Array.from(root.querySelectorAll('nav a'), (link) =>
      decodeURIComponent(link.getAttribute('href') ?? ''),
    );

    expect(hrefs).toEqual([
      '/entrar',
      '/proximamente?opcion=Buscar sala',
      '/proximamente?opcion=Ranking',
      '/proximamente?opcion=Cómo jugar',
    ]);
  });

  it('oculta la consola decorativa a lectores de pantalla', async () => {
    const root = await renderWelcome();
    const consoleSvg = root.querySelector('svg.console');

    expect(consoleSvg?.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelectorAll('.option-icon[aria-hidden="true"]')).toHaveLength(4);
  });
});
